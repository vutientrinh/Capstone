import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "auth";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  username: "",
};

const authSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const login = createAction(
  `${name}/LOGIN`,
  (username: string, password: string) => ({
    payload: { username, password },
  })
);
export const logout = createAction(`${name}/LOGOUT`);
// selectors
export const selectState = (state: any) => state[name];
export const selectIsAuthenticated = createSelector(
  selectState,
  (state) => state.isAuthenticated
);
export const selectIsLoading = createSelector(
  selectState,
  (state) => state.isLoading
);
export const selectUsername = createSelector(
  selectState,
  (state) => state.username
);

export const { actions } = authSlice;
export default authSlice;
