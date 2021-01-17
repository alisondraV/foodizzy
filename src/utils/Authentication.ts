import firebase from "firebase";

export default class Authentication {
  public static async getCurrentUser(): Promise<firebase.User | null> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user));
      // TODO: handle timeout
    });
  }

  public static async signIn(email: string, password: string) {
    try {
      const cred = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      return cred.user;
    } catch (error) {
      console.log("SignIn failed: ", error);
    }
  }

  public static async signOut() {
    try {
      return await firebase.auth().signOut();
    } catch (error) {
      console.log("SignOut failed: ", error);
    }
  }

  public static async signUp(email: string, password: string) {
    try {
      const cred = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return cred.user;
    } catch (error) {
      console.log("Sign Up failed: ", error);
    }
  }

  public static async signUpThroughGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCred = await firebase.auth().signInWithPopup(provider);
      return userCred.user;
    } catch (error) {
      console.log("Sign Up with Google failed: ", error);
    }
  }
}
