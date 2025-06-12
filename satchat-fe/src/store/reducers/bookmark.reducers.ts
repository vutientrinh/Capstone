import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "bookmark";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  bookmarks: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
};
const bookmarkSlice = createSlice({
  name,
  initialState,
  reducers: {
    setBookmarks: (
      state,
      action: PayloadAction<{
        bookmarks: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      const { bookmarks, currentPage, totalPages } = action.payload;
      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.bookmarks = bookmarks;
      } else {
        const existingPosts = state.bookmarks.map((post) => post.id);
        const obj = bookmarks.filter(
          (post) => !existingPosts.includes(post.id)
        );
        state.bookmarks = [...state.bookmarks, ...obj];
      }

      state.hasMore = currentPage < totalPages;
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

//actions
export const getBookmark = createAction(
  `${name}/GET_BOOKMARK`,
  (pageNum: any) => ({
    payload: { pageNum },
  })
);

//selectors
export const selectState = (state: any) => state[name];
export const selectBookmark = createSelector(
  selectState,
  (state) => state.bookmarks
);

// Pagination
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

export const { actions } = bookmarkSlice;
export default bookmarkSlice;
