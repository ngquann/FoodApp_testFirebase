import { fetchCart, fetchUser } from "../ultis/fetchLocalStorageData";

const userInfo = fetchUser();
const cartInfo = fetchCart();

export const initialState = {
    user: userInfo,
    foodItems: null,
    cartShow: false,
    cartItems: cartInfo,
};