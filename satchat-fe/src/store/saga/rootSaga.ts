import { fork } from "redux-saga/effects";
import profileSaga from "./profileSaga";
import postSaga from "./postSaga";
import topicSaga from "./topicSaga";
import notificationSaga from "./notificationSaga";
import bookmarkSaga from "./bookmarkSaga";
import trendingSaga from "./trendingSaga";
import productSaga from "./productSaga";
import productCommentSaga from "./productCommentSaga";
import cartSaga from "./cartSaga";
import addressSaga from "./addressSaga";
import orderSaga from "./orderSaga";
import likedProductSaga from "./likedProductSaga";
import adminSaga from "./adminSaga";
import convSaga from "./convSaga";
function* rootSaga() {
  yield fork(profileSaga);
  yield fork(postSaga);
  yield fork(topicSaga);
  yield fork(notificationSaga);
  yield fork(bookmarkSaga);
  yield fork(trendingSaga);
  yield fork(productSaga);
  yield fork(productCommentSaga);
  yield fork(cartSaga);
  yield fork(addressSaga);
  yield fork(orderSaga);
  yield fork(likedProductSaga);
  yield fork(adminSaga);
  yield fork(convSaga);
}

export default rootSaga;
