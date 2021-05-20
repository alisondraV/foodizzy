import * as functions from 'firebase-functions';
import { auth } from "./utils/admin";

export const getUsersByEmail = functions.https.onCall((data, context) => {
  if (!data.emails) {
    return [];
  }
  return Promise.all(data.emails.map((email: string) => auth.getUserByEmail(email)));
});