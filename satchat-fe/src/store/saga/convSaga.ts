import { call, put, takeEvery } from "typed-redux-saga";
import { commonStore, convStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getMessagesBefore(payload: any) {
  const { messageId, convId, page } = payload.payload as {
    messageId: string;
    convId: string;
    page: number;
  };
  try {
    yield* put(convStore.actions.setLoading(true));
    const response: {
      data: {
        data: any[];
        currentPage: number;
        totalPages: number;
      };
    } = yield* call(backendClient.getMessageBefore, messageId, convId, page);
    const { data, currentPage, totalPages } = response.data;

    // put messages to store
    yield put(
      convStore.actions.setMessages({
        messages: data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Error fetching messages before:", error);
    yield* put(
      commonStore.actions.setErrorMessage("Failed to get messages before")
    );
  }
}

function* convSaga() {
  yield takeEvery(convStore.getMessagesBefore, getMessagesBefore);
}
export default convSaga;
