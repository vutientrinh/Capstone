import createSagaMiddleware from "@redux-saga/core";
import { configureStore, Store } from "@reduxjs/toolkit";
import rootReducers, { RootReducerType } from "./reducers/rootReducer";
import rootSaga from "./saga/rootSaga";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const makeStore = (): Store => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ immutableCheck: false }).concat(sagaMiddleware),
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = makeStore();
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootReducerType> =
  useSelector;
