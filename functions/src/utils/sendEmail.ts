import axios from 'axios';
import { db } from './admin';

interface MailOptions {
  to: string[];
  message: {
    subject: string;
    html: string;
  };
}

export async function sendEmail(options: MailOptions): Promise<any> {
    try {
        return db.collection('mail').add(options);
    } catch (e) {
        console.error(`Something went wrong when sending an email to ${options.to}: ${e.message}`);
    }
}

export async function sendWelcomeEmails(
    newFamily: FirebaseFirestore.DocumentData,
    oldFamily?: FirebaseFirestore.DocumentData
) {
    const oldMembers = oldFamily?.pendingMembers ?? [];
    const newMembers = newFamily?.pendingMembers ?? [];
    const newEmails = newMembers.filter((email: any) => {
        return !oldMembers.find((oldEmail: any) => oldEmail === email);
    });

    console.log('New Members: ', newEmails);

    const htmlURL =
    'https://firebasestorage.googleapis.com/v0/b/foodizzy-app.appspot.com/o/Foodizzy.html?alt=media&token=53d69dc9-3b9a-42fc-a6d8-9a89efdcc26b';
    const response = await axios.get(htmlURL);
    let emailTemplate = response.data;

    emailTemplate = emailTemplate.replace('{PERSON}', 'Somebody');
    emailTemplate = emailTemplate.replace('{FAMILY NAME}', `"${newFamily.name}"`);

    return Promise.all(
        newEmails.map((email: string) => {
            return sendEmail({
                to: [email],
                message: {
                    subject: 'Welcome to Foodizzy!',
                    html: emailTemplate,
                },
            });
        })
    );
}
