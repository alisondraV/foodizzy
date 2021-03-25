import * as functions from 'firebase-functions';
import sendEmail from './sendEmail';
import axios from 'axios';
import {db} from './admin';

export const onFamilyUpdate = functions.firestore
    .document('/family/{familyId}')
    .onUpdate(async (change, context) => {
      const oldFamily = change.before.data();
      const newFamily = change.after.data();

      const newStorage = newFamily.storage;
      const oldStorage = oldFamily.storage;
      if (newStorage.length > oldStorage.length) {
        return updateTotalProducts(newFamily, oldFamily, change);
      }

      const newPendingMembers = newFamily.pendingMembers ?? [];
      const oldPendingMembers = oldFamily.pendingMembers ?? [];
      if (newPendingMembers.length > oldPendingMembers.length) {
        return sendWelcomeEmails(newFamily, oldFamily);
      }

      return checkForFamilyRemoval(change.after);
    });

export const onFamilyCreate = functions.firestore
    .document('/family/{familyId}')
    .onCreate((snapshot, context) => {
      const newFamily = snapshot.data();

      return sendWelcomeEmails(newFamily);
    });

export const onFamilyDelete = functions.firestore
    .document('/family/{familyId}')
    .onDelete(async (snapshot, context) => {
      const wasteBucketQueryResults = await db
          .collection('wasteBuckets')
          .where('familyId', '==', snapshot.id)
          .get();

      return Promise.all(wasteBucketQueryResults.docs.map((doc) => doc.ref.delete()));
    });

async function updateTotalProducts(
    newFamily: FirebaseFirestore.DocumentData,
    oldFamily: FirebaseFirestore.DocumentData,
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>
) {
  let addedProduct: any = null;
  newFamily.storage.forEach((newProduct: any) => {
    if (!oldFamily.storage.find((oldProduct: any) => newProduct.name === oldProduct.name)) {
      addedProduct = newProduct;
    }
  });
  console.log('A new product added: ', addedProduct);

  if (addedProduct == null) {
    throw new Error('The storages were the same');
  }

  const categoryName = addedProduct!.category.toLowerCase() ?? 'general';
  const updatedFamilyStats = change.after.ref.collection('statistics');

  const thisMonthStatsDoc = await getThisMonthStats(updatedFamilyStats, newFamily);
  const thisMonthData = thisMonthStatsDoc.data() ?? {};

  if (!Object.keys(thisMonthData.totalProducts).includes(categoryName)) {
    thisMonthData.totalProducts[categoryName] = 0;
  }
  thisMonthData.totalProducts[categoryName]++;

  return await updatedFamilyStats
      .doc(thisMonthStatsDoc.id)
      .update('totalProducts', thisMonthData.totalProducts);
}

async function getThisMonthStats(
    statsCollection: FirebaseFirestore.CollectionReference,
    family: any
) {
  const thisMonthStatsCollection = await statsCollection
      .where('month', '==', new Date().getMonth())
      .where('year', '==', new Date().getFullYear())
      .get();

  let thisMonthStatsDocRef;
  if (thisMonthStatsCollection.docs.length === 0) {
    const totalProducts = await getTotalProductsFromStorage(family);
    console.log('CREATE NEW: increasing number of ', totalProducts);
    thisMonthStatsDocRef = await statsCollection.add({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      totalProducts,
    });
  } else {
    thisMonthStatsDocRef = thisMonthStatsCollection.docs[0].ref;
  }
  return await thisMonthStatsDocRef.get();
}

async function getTotalProductsFromStorage(family: any) {
  const familyDocRef = await db.collection('family').doc(family.id).get();
  const storage = await familyDocRef.data()?.storage;

  return storage.reduce((currentStatistics: any, product: any) => {
    const category = (product.category ?? 'general').toLowerCase();
    if (!Object.keys(currentStatistics).includes(category)) {
      currentStatistics[category] = 0;
    }
    return currentStatistics;
  }, {});
}

async function sendWelcomeEmails(
    newFamily: FirebaseFirestore.DocumentData,
    oldFamily?: FirebaseFirestore.DocumentData
) {
  const oldMembers = oldFamily?.pendingMembers ?? [];
  const newMembers = newFamily?.pendingMembers ?? [];
  const newEmails = newMembers.filter((email: any) => {
    return !oldMembers.find((oldEmail: any) => oldEmail === email);
  });

  console.log('New Members: ', newEmails);

  const htmlURL = 'https://firebasestorage.googleapis.com/v0/b/foodizzy-app.appspot.com/o/email.html?alt=media&token=4627cac6-f9d5-4729-b177-26b345a09083';
  const response = await axios.get(htmlURL);
  let emailTemplate = response.data;

  emailTemplate = emailTemplate.replace('{PERSON}', 'Somebody');
  emailTemplate = emailTemplate.replace('{FAMILY NAME}', `"${newFamily.name}"`);

  return Promise.all(newEmails.map((email: string) => {
    return sendEmail({
      to: [email],
      message: {
        subject: 'Welcome to Foodizzy!',
        html: emailTemplate,
      },
    });
  }));
}

async function checkForFamilyRemoval(newDoc: FirebaseFirestore.QueryDocumentSnapshot) {
  const newFamily = newDoc.data();
  if (newFamily.members?.length === 0) {
    const statisticsRefs = await newDoc.ref.collection('statistics').get();
    await Promise.all(statisticsRefs.docs.map((doc) => doc.ref.delete()));
    return newDoc.ref.delete();
  }
  return null;
}

