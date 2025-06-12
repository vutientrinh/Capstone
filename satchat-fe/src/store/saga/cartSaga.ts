import { call, put, takeEvery } from "typed-redux-saga";
import { cartStore, commonStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getCartItems(payload: any) {
  const userId = payload.payload;
  try {
    // endpoint: /api/cart/{userId}
    const response: any = yield* call(backendClient.getCart, userId);
    if (!response?.data) {
      return;
    }
    const result = response?.data.data;
    yield* put(cartStore.actions.setCart(result));
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    yield* put(
      commonStore.actions.setErrorMessage("Failed to fetch cart items")
    );
  }
}

function* cartSaga() {
  yield takeEvery(cartStore.getCartItems, getCartItems);
}
export default cartSaga;
