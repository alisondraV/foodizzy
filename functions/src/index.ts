import * as functions from "firebase-functions";

export const helloWorld = functions.firestore
  .document("/family/{familyId}")
  .onUpdate((change, context) => {

    const oldFamily = change.before.data();
    const newFamily = change.after.data();

    if (oldFamily.storage.length >= newFamily.storage.length) {
      return
    }

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

    change.after.ref.update("totalProducts", newFamily.totalProducts)
  });
