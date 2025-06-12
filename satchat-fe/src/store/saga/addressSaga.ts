import { call, put, takeEvery } from "typed-redux-saga";
import { addressStore, commonStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getAllAddresses(payload: any) {
  const { pageNum } = payload.payload;
  try {
    yield* put(addressStore.actions.setLoading(true));
    // endpoints: /products?page=:pageNum
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.getAddress, pageNum);
    const { data, currentPage, totalPages } = response.data.data;

    // put address to store
    yield put(
      addressStore.actions.setAddresses({
        addresses: data,
        currentPage,
        totalPages,
      })
    );
    yield* put(addressStore.actions.setLoading(false));
  } catch (e) {
    console.error(e);
    yield* put(commonStore.actions.setErrorMessage("Failed to get addresses"));
  }
}

function* addressSaga() {
  yield takeEvery(addressStore.getAllAddresses, getAllAddresses);
}

export default addressSaga;
