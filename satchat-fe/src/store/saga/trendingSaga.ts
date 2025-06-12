import { put, call, takeEvery } from "typed-redux-saga";
import { commonStore, trendingStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getPostsTrending(payload: any) {
  const { pageNum, filter } = payload.payload;
  try {
    yield* put(trendingStore.actions.setLoading(true));
    // endpoints: /posts/trending?page=:pageNum
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.trendingPosts, pageNum, filter);
    const { data, currentPage, totalPages } = response.data.data;

    // put posts to store
    yield* put(
      trendingStore.actions.fecthPostsPaging({
        posts: data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to get posts"));
  }
}

function* trendingSaga() {
  yield takeEvery(trendingStore.getPostsTrending, getPostsTrending);
}
export default trendingSaga;
