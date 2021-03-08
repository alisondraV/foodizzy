import {db} from "./admin";

interface MailOptions {
    to: string[];
    message: {
      subject: string;
      html: string;
    }
}

export default async function sendEmail(options: MailOptions): Promise<any> {
  try {
    return db.collection("mail").add(options);
  } catch (e) {
    console.error(`Something went wrong when sending an email to ${options.to}: ${e.message}`);
  }
}
