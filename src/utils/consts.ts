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
  "auth/invalid-email": "Please enter a valid email"
};
