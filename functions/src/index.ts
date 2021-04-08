import * as functions from 'firebase-functions';
import sendEmail from './sendEmail';
import axios from 'axios';
import {db, auth} from './admin';
import * as tf from '@tensorflow/tfjs-node'

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

      return Promise.all(
          wasteBucketQueryResults.docs.map((doc) => doc.ref.delete())
      );
    });

export const syncEmulatorAllProducts = functions.https.onCall(
    async (data, context) => {
      const allProductsRef = db.collection('allProducts');
      const allProductsSnap = await allProductsRef.get();
      await Promise.all(
          (await allProductsSnap).docs.map((doc) => doc.ref.delete())
      );

      return Promise.all(
          data.products.map((product: FirebaseFirestore.DocumentData) => {
            const id = product.id;
            delete product.id;
            return db.doc(`allProducts/${id}`).set(product);
          })
      );
    }
);

export const getUsersByEmail = functions.https.onCall((data, context) => {
  if (!data.emails) {
    return [];
  }
  return Promise.all(
      data.emails.map((email: string) => auth.getUserByEmail(email))
  );
});

const labels = require('../model/assets/labels.json');

export const getModel = functions.https.onCall(async (data, context) => {
  return tf.loadGraphModel('https://tfhub.dev/google/bit/m-r50x1/1');
//   const modelFolder = path.join(__dirname, '/food-model');
//   console.log(await tf.node.getMetaGraphsFromSavedModel(modelFolder))
  
//   return tf.node.loadSavedModel(modelFolder, [], 'image_classifier')
})

export const predict = functions.https.onCall(async (data, context) => {
  const uint8array = new Uint8Array(Object.values(data.array));

  // Decode the image into a tensor.
  const imageTensor = await tf.node.decodeImage(uint8array);
  const input = imageTensor.expandDims(0);

  // Feed the image tensor into the model for inference.
  const startTime = tf.util.now();
  const objectDetectionModel: any = await tf.node.loadSavedModel(
    './model', ['serve'], 'serving_default');
  let outputTensor = objectDetectionModel.predict({'x': input});

  // Parse the model output to get meaningful result(get detection class and
  // object location).
  const scores = await outputTensor['detection_scores'].arraySync();
  const boxes = await outputTensor['detection_boxes'].arraySync();
  const names = await outputTensor['detection_classes'].arraySync();
  const endTime = tf.util.now();
  outputTensor['detection_scores'].dispose();
  outputTensor['detection_boxes'].dispose();
  outputTensor['detection_classes'].dispose();
  outputTensor['num_detections'].dispose();
  const detectedBoxes = [];
  const detectedNames = [];
  for (let i = 0; i < scores[0].length; i++) {
    if (scores[0][i] > 0.3) {
      detectedBoxes.push(boxes[0][i]);
      detectedNames.push(labels[names[0][i]]);
    }
  }
  return {
    // boxes: detectedBoxes,
    names: detectedNames,
    inferenceTime: endTime - startTime
  }
})

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

  const thisMonthStatsDoc = await getThisMonthStats(updatedFamilyStats);
  const thisMonthData = thisMonthStatsDoc.data() ?? {};

  for (const addedProduct of addedProducts) {
    const categoryName = addedProduct!.category.toLowerCase() ?? 'general';
  
    if (!Object.keys(thisMonthData.totalProducts).includes(categoryName)) {
      thisMonthData.totalProducts[categoryName] = 0;
    }

    thisMonthData.totalProducts[categoryName]++;
  }

  return await updatedFamilyStats
      .doc(thisMonthStatsDoc.id)
      .update('totalProducts', thisMonthData.totalProducts);
}

async function getThisMonthStats(statsCollection: FirebaseFirestore.CollectionReference) {
  const thisMonthStatsCollection = await statsCollection
      .where('month', '==', new Date().getMonth())
      .where('year', '==', new Date().getFullYear())
      .get();

  let thisMonthStatsDocRef;
  if (thisMonthStatsCollection.docs.length === 0) {
    thisMonthStatsDocRef = await statsCollection.add({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      totalProducts: {},
    });
  } else {
    thisMonthStatsDocRef = thisMonthStatsCollection.docs[0].ref;
  }
  return await thisMonthStatsDocRef.get();
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
            html: emailTemplate,
          },
        });
      })
  );
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
