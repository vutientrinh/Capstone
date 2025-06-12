import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, likedProductStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* likedProduct(payload: any) {
  const { pageNum } = payload.payload;
  try {
    yield* put(likedProductStore.actions.setLoading(true));
    // endpoints: /products?page=:pageNum
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.getLikedProducts, pageNum);
    const { data, currentPage, totalPages } = response.data.data;

    // put products to store
    yield put(
      likedProductStore.actions.setLikedProducts({
        likedProducts: data,
        currentPage,
        totalPages,
      })
    );
    yield* put(likedProductStore.actions.setLoading(false));
  } catch (e) {
    console.error(e);
    yield* put(
      commonStore.actions.setErrorMessage("Failed to get liked products")
    );
  }
}

function* likedProductSaga() {
  yield* takeEvery(likedProductStore.getLikedProducts, likedProduct);
}
export default likedProductSaga;
