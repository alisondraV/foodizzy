import firebase from "firebase";
import {CurrentFamily} from "@/types";

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
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => resolve(user));
      // TODO: handle timeout
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
}
