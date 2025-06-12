import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, productCommentStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getComments(payload: any) {
  const { productId, pageNum } = payload.payload;
  try {
    yield* put(productCommentStore.actions.setLoading(true));
    // endpoints: /products/:productId/comments
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.getCommentByProduct, productId, pageNum);
    const { data, currentPage, totalPages } = response.data.data;

    // put products to store
    yield put(
      productCommentStore.actions.setComments({
        comments: data,
        currentPage,
        totalPages,
      })
    );
    yield* put(productCommentStore.actions.setLoading(false));
  } catch (e) {
    console.error(e);
    yield* put(commonStore.actions.setErrorMessage("Failed to get comments"));
  }
}

function* productCommentSaga() {
  yield takeEvery(productCommentStore.getComments, getComments);
}
export default productCommentSaga;
