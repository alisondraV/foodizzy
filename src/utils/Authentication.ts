import firebase from 'firebase';
import { CurrentFamily } from '@/types';
import Firestore from '@/utils/Firestore';

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

    if (process.env.NODE_ENV === 'development') {
      this.auth.useEmulator('http://localhost:9099/');
      // TODO: use the below option, when the type issue is resolved
      //  (https://github.com/firebase/firebase-js-sdk/issues/4223)
      // this.auth.useEmulator('http://localhost:9099/', { disableWarnings: true });
    }
  }

  public async getCurrentUser(): Promise<firebase.User | null> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(resolve);
      setTimeout(() => reject('Timeout'), 5000);
    });
  }

  public signIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  public async signOut() {
    try {
      await firebase.auth().signOut();
      CurrentFamily.instance.family = null;
    } catch (error) {
      console.log('SignOut failed: ', error);
    }
  }

  public signUp(email: string, password: string, name: string) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        return firebase.auth().currentUser?.updateProfile({ displayName: name });
      });
  }

  public async authWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCred = await firebase.auth().signInWithPopup(provider);
      return userCred.user;
    } catch (error) {
      console.log('Sign Up with Google failed: ', error);
    }
  }

  public async updateCurrentUser(prevUser: firebase.User, name: string, email: string) {
    if (CurrentFamily.instance.family) {
      const familyRef = Firestore.instance.db
        .collection('family')
        .doc((await CurrentFamily.instance.getCurrentFamily()).id);

      if (prevUser.email !== email) {
        await familyRef.update('members', firebase.firestore.FieldValue.arrayUnion(email));
        await familyRef.update('members', firebase.firestore.FieldValue.arrayRemove(prevUser.email));
      }
    }

    await firebase.auth().currentUser!.updateProfile({ displayName: name });
    await firebase.auth().currentUser!.updateEmail(email);
    CurrentFamily.instance.family = null;
  }

  public async sendPasswordReset(email: string) {
    await this.auth.sendPasswordResetEmail(email);
  }

  public async changePassword(email: string, currentPassword: string, newPassword: string) {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
    await user!.reauthenticateWithCredential(cred);
    await user!.updatePassword(newPassword);
  }
}
