import * as functions from "firebase-functions";

export const onFamilyUpdate = functions.firestore
    .document("/family/{familyId}")
    .onUpdate(async (change) => {
      const oldFamily = change.before.data();
      const updatedFamily = change.after.data();

      if (oldFamily.storage.length >= updatedFamily.storage.length) {
        return;
      }

      let addedProduct: any = null;
      updatedFamily.storage.forEach((newProduct: any) => {
        if (!oldFamily.storage.find((oldProduct: any) => newProduct.name === oldProduct.name)) {
          addedProduct = newProduct;
        }
      });

      if (addedProduct == null) {
        throw new Error("The storages were the same");
      }
      console.log("A new product added: ", addedProduct);

      const categoryName = addedProduct!.category.toLowerCase() ?? "general";
      const updatedFamilyStats = change.after.ref.collection("statistics");

      if ((await updatedFamilyStats.get()).docs.length === 0) {
        await change.after.ref.collection("statistics").add({
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          totalProducts: {},
        });
      }

      const thisMonthStatsCollection = await updatedFamilyStats
          .where("month", "==", new Date().getMonth())
          .where("year", "==", new Date().getFullYear())
          .get();
      const thisMonthData = thisMonthStatsCollection.docs[0].data();

      if (!Object.keys(thisMonthData.totalProducts).includes(categoryName)) {
        thisMonthData.totalProducts[categoryName] = 0;
      }
      thisMonthData.totalProducts[categoryName]++;

      return await updatedFamilyStats
          .doc(thisMonthStatsCollection.docs[0].id)
          .update("totalProducts", thisMonthData.totalProducts);
    });
