import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "socket";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  socketClient: null as any,
};

const socketSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setSocketClient(state, action: PayloadAction<any>) {
      state.socketClient = action.payload;
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
export const selectSocketClient = createSelector(
  selectState,
  (state) => state.socketClient
);

export const { actions } = socketSlice;
export default socketSlice;
