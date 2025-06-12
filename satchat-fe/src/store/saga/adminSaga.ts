import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, adminStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getRecPostById(payload: any) {
  const { pageNum, userId } = payload.payload;
  try {
    yield* put(adminStore.actions.setLoadingPostRec(true));
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.getRecPostsByUserId, pageNum, userId);
    const { data, currentPage, totalPages } = response.data.data;

    // put posts to store
    yield put(
      adminStore.actions.setPostRec({
        data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    yield* put(commonStore.actions.setErrorMessage("Failed to get posts"));
  }
}

function* adminSaga() {
  yield takeEvery(adminStore.getRecPostById, getRecPostById);
}
export default adminSaga;
