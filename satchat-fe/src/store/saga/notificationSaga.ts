import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, notificationStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getNotifications(payload: any) {
  const { pageNum, filter } = payload.payload as {
    pageNum: any;
    filter: any;
  };
  try {
    yield* put(notificationStore.actions.setLoading(true));
    // endpoints: /notifications?page=:pageNum
    const response: {
      data: {
        data: any[];
        currentPage: number;
        totalPages: number;
      };
    } = yield* call(backendClient.getNotifications, pageNum, filter);
    const { data, currentPage, totalPages } = response.data;

    // put posts to store
    yield put(
      notificationStore.actions.setNotifications({
        notifications: data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    yield* put(
      commonStore.actions.setErrorMessage("Failed to get notifications")
    );
  }
}

function* notificationSaga() {
  yield takeEvery(notificationStore.getNotifications, getNotifications);
}

export default notificationSaga;
