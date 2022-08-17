import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { firestore } from "../firebase.config";

// Saving new items
export const saveItems = async (data) => {
    await setDoc(doc(firestore, 'foodItems', `${Date.now()}`), data, {merge: true});
}

// Get all Item
export const getAllFoodItems = async () => {
    const items = await getDocs(
        query(collection(firestore, "foodItems"), orderBy("id", "desc"))
    )
    return items.docs.map(doc => doc.data());
};