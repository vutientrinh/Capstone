import { call, put, takeEvery } from "typed-redux-saga";
import { topicStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getTopics() {
  try {
    const response = yield* call(backendClient.getAllTopics);
    if (!response?.data) {
      return;
    }
    const result = response?.data.data;
    yield put(topicStore.actions.setTopics(result));
  } catch (error) {
    console.error("Error fetching topics", error);
  }
}

function* topicSaga() {
  yield takeEvery(topicStore.getTopics, getTopics);
}

export default topicSaga;
