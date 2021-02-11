import {createTransport} from "nodemailer";
import * as functions from "firebase-functions";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: functions.config().mail.from,
    pass: functions.config().mail.pass,
  },
});

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    from?: string;
}

export default async function sendEmail(options: MailOptions): Promise<any> {
  options = {
    ...options,
    from: functions.config().mail.from,
  };

  try {
    if (process.env.NODE_ENV === "production") {
      await transporter.sendMail(options);
      console.log(`An invite email was sent to ${options.to}`);
    } else {
      const message = "The email was sent, but not really (in development).";
      console.log(message);
      return {code: 200, message};
    }
  } catch (e) {
    console.error(`Something went wrong when sending an email to ${options.to}: ${e.message}`);
  }
}
