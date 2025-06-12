import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, productStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getProducts(payload: any) {
  const { pageNum, filter, isDefault } = payload.payload;
  try {
    yield* put(productStore.actions.setLoading(true));
    // endpoints: /products?page=:pageNum
    let response: {
      data: {
        data: any[];
        currentPage: number;
        totalPages: number;
      };
    };
    if (isDefault) {
      response = yield* call(backendClient.getRecProducts, pageNum);
    } else {
      response = yield* call(backendClient.getProductsPerPage, pageNum, filter);
    }
    const { data, currentPage, totalPages } = response.data;

    // put products to store
    yield put(
      productStore.actions.setProducts({
        products: data,
        currentPage,
        totalPages,
      })
    );
    yield* put(productStore.actions.setLoading(false));
  } catch (e) {
    console.error(e);
    yield* put(commonStore.actions.setErrorMessage("Failed to get products"));
  }
}

function* productSaga() {
  yield takeEvery(productStore.getProducts, getProducts);
}
export default productSaga;
