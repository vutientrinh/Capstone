import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "productComment";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  productComment: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
};

const productCommentSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setComments(
      state,
      action: PayloadAction<{
        comments: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { comments, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.productComment = comments;
      } else {
        state.productComment = [...state.productComment, ...comments];
      }
      state.hasMore = currentPage < totalPages;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    // add comment
    addComment(state, action: PayloadAction<any>) {
      state.productComment = [action.payload, ...state.productComment];
    },
  },
  extraReducers: (builder) => {
    // add các case fetch sẽ loading
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getComments = createAction(
  `${name}/GET_PRODUCT_COMMENTS`,
  (productId: any, pageNum: number) => ({
    payload: { productId, pageNum },
  })
);

// selectors
export const selectState = (state: any) => state[name];

export const selectProductComments = createSelector(
  selectState,
  (state) => state.productComment
);
export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);
export const selectCurrentPage = createSelector(
  selectState,
  (state) => state.currentPage
);
export const selectTotalPages = createSelector(
  selectState,
  (state) => state.totalPages
);
export const selectHasMore = createSelector(
  selectState,
  (state) => state.hasMore
);

export const { actions } = productCommentSlice;
export default productCommentSlice;
