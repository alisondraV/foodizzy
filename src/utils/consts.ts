import tailwind from "../../tailwind.config";
export const colors: string[] = Object.values(tailwind.theme.colors);

export const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const authErrors = {
  "auth/invalid-email": {
    type: "email",
    message: "Please enter a valid email."
  },
  "auth/invalid-password": {
    type: "password",
    message: "Wrong password. Please try again."
  },
  "auth/wrong-password": {
    type: "password",
    message: "Wrong password. Please try again."
  },
  "auth/user-not-found": {
    message:
      "We could not find a user that corresponds to this email. Try signing up."
  }
};
