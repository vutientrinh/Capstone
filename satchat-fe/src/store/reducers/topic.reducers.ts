import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "topic";
export const resetState = createAction(`${name}/RESET_STATE`);

const initialState = {
  topics: [] as any[],
};

const topicSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setTopics(state, action: PayloadAction<any>) {
      state.topics = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getTopics = createAction(`${name}/GET_TOPICS`);

// selectors
export const selectState = (state: any) => state[name];
export const selectTopics = createSelector(
  selectState,
  (state) => state.topics
);

export const { actions } = topicSlice;
export default topicSlice;
