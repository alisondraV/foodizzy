import Firestore from "./Firestore";
import docs from './data.json'

export async function logCollection(name: string) {
    const allProductsSnap = await Firestore.instance.db.collection('allProducts').get()

    const allProducts = allProductsSnap.docs.map(doc => doc.data())

    console.log(JSON.stringify(allProducts));
}

export async function fillCollection(name: string) {
    const allProductsCollection = await Firestore.instance.db.collection('allProducts')

    docs.forEach(doc => {
        allProductsCollection.add(doc)
    })
} 
