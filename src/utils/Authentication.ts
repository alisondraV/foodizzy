import firebase from "firebase";

export default class Authentication {
  public static onAuthStateChanged(
    callback: (user: firebase.User | null) => any
  ) {
    firebase.auth().onAuthStateChanged(callback);
  }

  public static getCurrentUser() {
    try {
      return firebase.auth().currentUser;
    } catch (error) {
      console.log("Failed to load the user: ", error);
    }
  }

  public static async signIn(email: string, password: string) {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log("User: ", user);
    } catch (error) {
      console.log("SignIn failed: ", error);
    }
  }

  public static async signUp(email: string, password: string) {
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log("User: ", user);
    } catch (error) {
      console.log("Sign Up failed: ", error);
    }
  }

  public static async signUpThroughGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log("Sign Up with Google failed: ", error);
    }
  }
}
