import firebase from "firebase";
import { CurrentFamily } from "@/types";
import Firestore from "@/utils/Firestore";

export default class Authentication {
  public auth: firebase.auth.Auth;

  private static _instance: Authentication | null = null;

  public static get instance(): Authentication {
    if (this._instance === null) {
      this._instance = new Authentication();
    }
    return this._instance;
  }

  private constructor() {
    this.auth = firebase.auth();

    if (process.env.NODE_ENV === "development") {
      this.auth.useEmulator("http://localhost:9099/");
      // TODO: use the below option, when the type issue is resolved
      //  (https://github.com/firebase/firebase-js-sdk/issues/4223)
      // this.auth.useEmulator('http://localhost:9099/', { disableWarnings: true });
    }
  }

  public async getCurrentUser(): Promise<firebase.User | null> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(resolve);
      setTimeout(() => reject("Timeout"), 5000);
    });
  }

  public async signIn(email: string, password: string) {
    try {
      const cred = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      return cred.user;
    } catch (error) {
      console.log("SignIn failed: ", error);
    }
  }

  public async signOut() {
    try {
      await firebase.auth().signOut();
      CurrentFamily.instance.family = null;
    } catch (error) {
      console.log("SignOut failed: ", error);
    }
  }

  public async signUp(email: string, password: string, name: string) {
    try {
      const cred = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      firebase.auth().currentUser?.updateProfile({ displayName: name });
      return cred.user;
    } catch (error) {
      console.log("Sign Up failed: ", error);
    }
  }

  public async authWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCred = await firebase.auth().signInWithPopup(provider);
      return userCred.user;
    } catch (error) {
      console.log("Sign Up with Google failed: ", error);
    }
  }

  public async updateCurrentUser(prevUser: firebase.User, name: string, email: string) {
    const familyRef = Firestore.instance.db
        .collection("family")
        .doc((await CurrentFamily.instance.getCurrentFamily()).id);

    await familyRef.update("members", firebase.firestore.FieldValue.arrayRemove(prevUser.email));
    await familyRef.update("members", firebase.firestore.FieldValue.arrayUnion(email));

    await firebase.auth().currentUser!.updateProfile({ displayName: name });
    await firebase.auth().currentUser!.updateEmail(email);
  }
}
