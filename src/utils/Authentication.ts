import firebase from "firebase";

export default class Authentication {
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
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;
            const credential = result.credential;
            // const token = credential.accessToken;
        } catch (error) {
            console.log("Sign Up failed: ", error);
        }
    }
}