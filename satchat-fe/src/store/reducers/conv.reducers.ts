import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "conv";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  messages: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
};

const convSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setMessages(
      state,
      action: PayloadAction<{
        messages: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { messages, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.messages = messages;
      } else {
        const existingPosts = state.messages.map((post) => post.id);
        const nowMessages = messages.filter(
          (post) => !existingPosts.includes(post.id)
        );
        state.messages = [...nowMessages, ...state.messages];
      }

      state.hasMore = currentPage < totalPages;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    setMessagesToEmpty(state) {
      state.messages = [];
    },
    appendMessages: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getMessagesBefore = createAction(
  `${name}/GET_MESSAGES_BEFORE`,
  (messageId: string, convId: string, page: number) => ({
    payload: { messageId, convId, page },
  })
);

// selectors
export const selectState = (state: any) => state[name];
export const selectMessages = createSelector(
  selectState,
  (state) => state.messages
);
export const selectCurrentPage = createSelector(
  selectState,
  (state) => state.currentPage
);
export const selectTotalPages = createSelector(
  selectState,
  (state) => state.totalPages
);
export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);
export const selectHasMore = createSelector(
  selectState,
  (state) => state.hasMore
);

export const { actions } = convSlice;
export default convSlice;
