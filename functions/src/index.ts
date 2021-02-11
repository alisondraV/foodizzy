import * as functions from "firebase-functions";

export const onFamilyUpdate = functions.firestore
  .document("/family/{familyId}")
  .onUpdate((change, context) => {
    const oldFamily = change.before.data();
    const newFamily = change.after.data();

    if (newFamily.storage.length > oldFamily.storage.length) {
      return updateTotalProducts(newFamily, oldFamily, change);
    }
    
    if (newFamily.members.length > oldFamily.members.length) {
      return sendWelcomeEmails(newFamily, oldFamily);
    }

    return null;
  });

function updateTotalProducts(
  newFamily: FirebaseFirestore.DocumentData, 
  oldFamily: FirebaseFirestore.DocumentData, 
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>
) {
  let addedProduct: any = null
  newFamily.storage.forEach((newProduct: any) => {
    if (!oldFamily.storage.find((oldProduct: any) => newProduct.name === oldProduct.name)) {
      addedProduct = newProduct
    }
  })
  console.log("A new product added: ", addedProduct);

  if (addedProduct == null) {
    throw new Error("The storages were the same")
  }

  const categoryName = addedProduct!.category.toLowerCase() ?? "general"

  if (!Object.keys(newFamily.totalProducts).includes(categoryName)) {
    newFamily.totalProducts[categoryName] = 0
  }
  newFamily.totalProducts[categoryName]++

  return change.after.ref.update("totalProducts", newFamily.totalProducts)
}

function sendWelcomeEmails(
  newFamily: FirebaseFirestore.DocumentData, 
  oldFamily: FirebaseFirestore.DocumentData
) {
  const newEmails = newFamily.members.filter((email: any) => {
    return !oldFamily.members.find((oldEmail: any) => oldEmail === email);
  })

  console.log(newEmails)
}