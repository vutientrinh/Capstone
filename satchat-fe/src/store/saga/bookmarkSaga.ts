import { call, put, takeEvery } from "typed-redux-saga";
import { bookmarkStore, commonStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getBookmark(payload: any) {
  const { pageNum } = payload.payload as {
    pageNum: any;
  };
  try {
    // endpoint to fetch bookmarks
    const response: any = yield* call(backendClient.getSavedPosts, pageNum);
    const result = response.data;
    const { data, currentPage, totalPages } = result.data;
    yield* put(
      bookmarkStore.actions.setBookmarks({
        bookmarks: data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    yield* put(
      commonStore.actions.setErrorMessage("Failed to fetch bookmarks")
    );
  }
}

function* bookmarkSaga() {
  yield takeEvery(bookmarkStore.getBookmark, getBookmark);
}
export default bookmarkSaga;
