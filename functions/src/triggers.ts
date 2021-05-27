import * as functions from 'firebase-functions';
import { db } from './utils/admin';
import { sendWelcomeEmails } from './utils/sendEmail';

export const onFamilyUpdate = functions.firestore
    .document('/family/{familyId}')
    .onUpdate(async (change, context) => {
        const oldFamily = change.before.data();
        const newFamily = change.after.data();
        await createStatisticsIfDoesNotExist(change, oldFamily);

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

export const syncEmulatorAllProducts = functions.https.onCall(async (data, context) => {
    const allProductsRef = db.collection('allProducts');
    const allProductsSnap = await allProductsRef.get();
    await Promise.all((await allProductsSnap).docs.map((doc) => doc.ref.delete()));

    return Promise.all(
        data.products.map((product: FirebaseFirestore.DocumentData) => {
            const id = product.id;
            delete product.id;
            return db.doc(`allProducts/${id}`).set(product);
        })
    );
});

async function createStatisticsIfDoesNotExist(change: any, family: FirebaseFirestore.DocumentData) {
    const familyStats = change.before.ref.collection('statistics');
    const thisMonthStatsDoc = await findThisMonthStats(familyStats);

    if (thisMonthStatsDoc) {
        return;
    }
    const totalProducts = await getTotalProducts(family.storage);
    const thisMonthStatsDocRef = await familyStats.add({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        totalProducts,
    });

    return await thisMonthStatsDocRef.get();
}

async function updateTotalProducts(
    newFamily: FirebaseFirestore.DocumentData,
    oldFamily: FirebaseFirestore.DocumentData,
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>
) {
    const addedProducts: any[] = newFamily.storage.filter((newProduct: any) => {
        return !oldFamily.storage.find((oldProduct: any) => newProduct.name === oldProduct.name);
    });

    if (addedProducts.length === 0) {
        throw new Error('The storages were the same');
    }
    console.log('New products were added: ', addedProducts);

    const updatedFamilyStats = change.after.ref.collection('statistics');
    const thisMonthStatsDoc = await findThisMonthStats(updatedFamilyStats);

    const newTotalProducts = thisMonthStatsDoc!.data().totalProducts;
    Object.entries(getTotalProducts(addedProducts)).forEach(([category, quantity]) => {
        if (!Object.keys(newTotalProducts).includes(category)) {
            newTotalProducts[category] = 0;
        }
        newTotalProducts[category] += parseInt(quantity as string);
    });

    return await updatedFamilyStats
        .doc(thisMonthStatsDoc!.id)
        .update('totalProducts', newTotalProducts);
}

async function findThisMonthStats(
    statsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
) {
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

async function checkForFamilyRemoval(newDoc: FirebaseFirestore.QueryDocumentSnapshot) {
    const newFamily = newDoc.data();
    if (newFamily.members?.length === 0) {
        const statisticsRefs = await newDoc.ref.collection('statistics').get();
        await Promise.all(statisticsRefs.docs.map((doc) => doc.ref.delete()));
        return newDoc.ref.delete();
    }
    return null;
}
