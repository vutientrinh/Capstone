import { combineReducers } from "redux";
import common from "./common.reducer";
import profile from "./profile.reducer";
import post from "./post.reducer";
import chat from "./chat.reducers";
import auth from "./auth.reducers";
import topic from "./topic.reducers";
import notification from "./notification.reducers";
import bookmark from "./bookmark.reducers";
import trending from "./trending.reducers";
import product from "./product.reducers";
import productComment from "./productComment.reducers";
import cart from "./cart.reducers";
import address from "./address.reducers";
import order from "./order.reducers";
import likedProduct from "./likedProduct.reducers";
import admin from "./admin.reducers";
import conv from "./conv.reducers";
const rootReducers = combineReducers({
  [common.name]: common.reducer,
  [profile.name]: profile.reducer,
  [post.name]: post.reducer,
  [chat.name]: chat.reducer,
  [auth.name]: auth.reducer,
  [topic.name]: topic.reducer,
  [notification.name]: notification.reducer,
  [bookmark.name]: bookmark.reducer,
  [trending.name]: trending.reducer,
  [product.name]: product.reducer,
  [productComment.name]: productComment.reducer,
  [cart.name]: cart.reducer,
  [address.name]: address.reducer,
  [order.name]: order.reducer,
  [likedProduct.name]: likedProduct.reducer,
  [admin.name]: admin.reducer,
  [conv.name]: conv.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducers>;
export default rootReducers;
