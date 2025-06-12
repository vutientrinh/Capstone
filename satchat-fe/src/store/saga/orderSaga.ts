import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, orderStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* fetchOrders(payload: any) {
  const { pageNum, filter } = payload.payload;
  yield* put(orderStore.actions.setLoading(true));
  try {
    const response: {
      data: {
        data: any[];
        currentPage: number;
        totalPages: number;
      };
    } = yield* call(backendClient.getLstOrders, pageNum, filter);
    const { data, currentPage, totalPages } = response.data;

    // put orders to store
    yield put(
      orderStore.actions.setOrders({
        orders: data,
        currentPage,
        totalPages,
      })
    );
    yield* put(orderStore.actions.setLoading(false));
  } catch (error) {
    console.error("Error fetching orders:", error);
    yield* put(commonStore.actions.setErrorMessage("Failed to get orders"));
  } finally {
    yield* put(orderStore.actions.setLoading(false));
  }
}

function* orderSaga() {
  yield takeEvery(orderStore.fetchOrders, fetchOrders);
}
export default orderSaga;
