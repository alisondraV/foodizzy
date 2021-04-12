import * as functions from 'firebase-functions';
import sendEmail from './sendEmail';
import axios from 'axios';
import { db, auth } from './admin';

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

    return Promise.all(wasteBucketQueryResults.docs.map(doc => doc.ref.delete()));
  });

export const syncEmulatorAllProducts = functions.https.onCall(async (data, context) => {
  const allProductsRef = db.collection('allProducts');
  const allProductsSnap = await allProductsRef.get();
  await Promise.all((await allProductsSnap).docs.map(doc => doc.ref.delete()));

  return Promise.all(
    data.products.map((product: FirebaseFirestore.DocumentData) => {
      const id = product.id;
      delete product.id;
      return db.doc(`allProducts/${id}`).set(product);
    })
  );
});

export const getUsersByEmail = functions.https.onCall((data, context) => {
  if (!data.emails) {
    return [];
  }
  return Promise.all(data.emails.map((email: string) => auth.getUserByEmail(email)));
});

async function updateTotalProducts(
  newFamily: FirebaseFirestore.DocumentData,
  oldFamily: FirebaseFirestore.DocumentData,
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>
) {
  let addedProducts: any[] = newFamily.storage.filter((newProduct: any) => {
    return !oldFamily.storage.find((oldProduct: any) => newProduct.name === oldProduct.name);
  });

  if (addedProducts.length === 0) {
    throw new Error('The storages were the same');
  }

  console.log('New products were added: ', addedProducts);

  const updatedFamilyStats = change.after.ref.collection('statistics');

  const thisMonthStatsDoc = await findThisMonthStats(updatedFamilyStats);

  if (!thisMonthStatsDoc) {
    return await createThisMonthStats(updatedFamilyStats, newFamily);
  }

  return await updatedFamilyStats
    .doc(thisMonthStatsDoc.id)
    .update('totalProducts', getTotalProducts(newFamily.storage));  
}

async function findThisMonthStats(statsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>) {
  const candidates = await statsCollection
  .where('month', '==', new Date().getMonth())
  .where('year', '==', new Date().getFullYear())
  .get();

  if (candidates.docs.length === 0) {
    return null;
  }

  return candidates.docs[0];
}

function getTotalProducts(products: any[]) {
  return products.reduce((totalProducts: any, product: any) => {
    const category = (product.category ?? 'general').toLowerCase();
    if (!Object.keys(totalProducts).includes(category)) {
      totalProducts[category] = 0;
    }
    totalProducts[category]++;
    return totalProducts;
  }, {});
}

async function createThisMonthStats(statsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>, family: any) {
  const totalProducts = await getTotalProductsFromStorage(family);
  const thisMonthStatsDocRef = await statsCollection.add({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    totalProducts
  });
  
  return await thisMonthStatsDocRef.get();
}

async function getTotalProductsFromStorage(family: any) {
  const familyDocRef = await db
      .collection('family')
      .doc(family.id)
      .get();
  const storage = await familyDocRef.data()?.storage;

  console.log({storage});
  

  return getTotalProducts(storage);
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
          html: emailTemplate
        }
      });
    })
  );
}

async function checkForFamilyRemoval(newDoc: FirebaseFirestore.QueryDocumentSnapshot) {
  const newFamily = newDoc.data();
  if (newFamily.members?.length === 0) {
    const statisticsRefs = await newDoc.ref.collection('statistics').get();
    await Promise.all(statisticsRefs.docs.map(doc => doc.ref.delete()));
    return newDoc.ref.delete();
  }
  return null;
}
