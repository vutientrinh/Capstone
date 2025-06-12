import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "chat";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  selectedUser: null,
};
const chatSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<any>) {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
// selectors
export const selectState = (state: any) => state[name];
export const selectSelectedUser = createSelector(
  selectState,
  (state) => state.selectedUser
);

export const { actions } = chatSlice;
export default chatSlice;
