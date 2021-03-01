import * as functions from "firebase-functions";
import sendEmail from "./sendEmail";

export const onFamilyUpdate = functions.firestore
    .document("/family/{familyId}")
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

      return null;
    });

export const onFamilyCreate = functions.firestore
    .document("/family/{familyId}")
    .onCreate((snapshot, context) => {
      const newFamily = snapshot.data();

      return sendWelcomeEmails(newFamily);
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
  console.log("A new product added: ", addedProduct);

  if (addedProduct == null) {
    throw new Error("The storages were the same");
  }

  const categoryName = addedProduct!.category.toLowerCase() ?? "general";
  const updatedFamilyStats = change.after.ref.collection("statistics");

  const thisMonthStatsDoc = await getThisMonthStats(updatedFamilyStats);
  const thisMonthData = thisMonthStatsDoc.data() ?? {};

  if (!Object.keys(thisMonthData.totalProducts).includes(categoryName)) {
    thisMonthData.totalProducts[categoryName] = 0;
  }
  thisMonthData.totalProducts[categoryName]++;

  return await updatedFamilyStats
      .doc(thisMonthStatsDoc.id)
      .update("totalProducts", thisMonthData.totalProducts);
}

async function getThisMonthStats(statsCollection: FirebaseFirestore.CollectionReference) {
  const thisMonthStatsCollection = await statsCollection
    .where("month", "==", new Date().getMonth())
    .where("year", "==", new Date().getFullYear())
    .get();

  let thisMonthStatsDocRef = null;
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

function sendWelcomeEmails(
    newFamily: FirebaseFirestore.DocumentData,
    oldFamily?: FirebaseFirestore.DocumentData
) {
  const oldMembers = oldFamily?.pendingMembers ?? [];
  const newMembers = newFamily?.pendingMembers ?? [];
  const newEmails = newMembers.filter((email: any) => {
    return !oldMembers.find((oldEmail: any) => oldEmail === email);
  });

  console.log('New Members: ', newEmails);

  return Promise.all(newEmails.map((email: string) => {
    const url = `https://foodizzy-app.web.app/invites`;

    return sendEmail({
      to: [email],
      message: {
        subject: "Welcome to Foodizzy!",
        html: `
          <p>Hi there! You have been invited to join your family members at Foodizy. <a href="${url}">Accept your invite</a></p>.
        `,
      }
    });
  }));
}
