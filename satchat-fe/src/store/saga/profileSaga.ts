import { takeEvery } from "redux-saga/effects";
import { all, call, put, select } from "typed-redux-saga";
import { commonStore, profileStore } from "../reducers";
import backendClient from "@/utils/BackendClient";
import { getCookie } from "cookies-next";

function* fetchCurrentUser() {
  try {
    const response: any = yield* call(
      backendClient.getUserByUserName,
      getCookie("username")
    );
    if (!response?.data) {
      return;
    }
    const result = response?.data.data;
    yield put(profileStore.actions.setCurrentUser(result));
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

function* getFriends(payload: any) {
  const { userId, pageNum } = payload.payload;
  try {
    // endpoint: /api/user/{userId}/friends
    const response: any = yield* call(
      backendClient.getAllFriends,
      userId,
      pageNum
    );
    if (!response?.data) {
      return;
    }
    const result = response?.data.data;
    const pagination = yield* select(profileStore.selectPaginationFriends);
    if (pageNum === 1) {
      yield put(profileStore.actions.setFriends(result.data));
    } else if (pageNum !== 1 && pagination?.hasMore) {
      yield put(profileStore.actions.appendFriends(result.data));
    }
    yield put(
      profileStore.actions.setPaginationFriends({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.currentPage < result.totalPages,
      })
    );
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to fetch friends"));
  }
}

function* getFriendRequests(payload: any) {
  const { userId, pageNum } = payload.payload;
  try {
    // endpoint: /api/user/{userId}/friends
    const response: any = yield* call(
      backendClient.getFriendRequests,
      userId,
      pageNum
    );
    if (!response?.data) {
      return;
    }
    const result = response?.data.data;
    const pagination = yield* select(profileStore.selectPaginationFriends);
    if (pageNum === 1) {
      yield put(profileStore.actions.setFriendRequests(result.data));
    } else if (pageNum > 1 && pagination?.hasMore) {
      yield put(profileStore.actions.appendFriendRequests(result.data));
    }
    yield put(
      profileStore.actions.setPaginationFriendRequests({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.currentPage < result.totalPages,
      })
    );
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to fetch friends"));
  }
}

function* getSuggestedFriends() {
  try {
    // endpoint: /api/user/suggested
    const response: any = yield* call(backendClient.getSuggestedFriends);
    if (!response?.data) {
      return;
    }
    const result = response?.data.data;
    yield put(profileStore.actions.setFriendSuggested(result));
    yield put(
      profileStore.actions.setPaginationFriends({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      })
    );
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to fetch friends"));
  }
}

function* profileSaga() {
  yield takeEvery(profileStore.getCurrentUser, fetchCurrentUser);
  yield takeEvery(profileStore.getFriends, getFriends);
  yield takeEvery(profileStore.getFriendRequests, getFriendRequests);
  yield takeEvery(profileStore.getSuggestedFriends, getSuggestedFriends);
}

export default profileSaga;
