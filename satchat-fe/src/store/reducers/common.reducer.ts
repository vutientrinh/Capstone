import { AlertColor } from "@mui/material";
import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "common";
export const resetState = createAction(`${name}/RESET_STATE`);

const initialState = {
  messageState: {
    message: "",
    status: "success" as AlertColor,
    display: false,
  },
  isLoading: false,
  searchBar: false,
};

const commonSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    // set error message
    setErrorMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "error";
      state.messageState.display = true;
    },
    // set warning message
    setWarningMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "warning";
      state.messageState.display = true;
    },
    // set success message
    setSuccessMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "success";
      state.messageState.display = true;
    },
    // set notification message
    setNotificationMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "info";
      state.messageState.display = true;
    },
    // set display message
    setDisplaymessage(state, action: PayloadAction<boolean>) {
      state.messageState.display = action.payload;
    },
    // set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // set search bar state
    setSearchBar(state, action: PayloadAction<boolean>) {
      state.searchBar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// selectors
export const selectState = (state: any) => state[name];
export const selectMessageState = createSelector(
  selectState,
  (state) => state.messageState
);
export const selectIsLoading = createSelector(
  selectState,
  (state) => state.isLoading
);
export const selectSearchBar = createSelector(
  selectState,
  (state) => state.searchBar
);

export const { actions } = commonSlice;
export default commonSlice;
