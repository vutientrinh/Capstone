import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "admin";
export const resetState = createAction(`${name}/RESET_STATE`);

const initialState = {
  postRec: {
    data: [] as any[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      loading: false,
      hasMore: true,
    },
  },
  productRec: {
    data: [] as any[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      loading: false,
      hasMore: true,
    },
  },
};

const adminSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setPostRec(
      state,
      action: PayloadAction<{
        data: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { data, currentPage, totalPages } = action.payload;

      state.postRec.pagination.loading = false;
      state.postRec.pagination.currentPage = currentPage;
      state.postRec.pagination.totalPages = totalPages;

      if (currentPage === 1) {
        state.postRec.data = data;
      } else {
        const existingPosts = state.postRec.data.map((post) => post.id);
        const nowNot = data.filter((post) => !existingPosts.includes(post.id));
        state.postRec.data = [...state.postRec.data, ...nowNot];
      }

      state.postRec.pagination.hasMore = currentPage < totalPages;
    },
    setProductRec(
      state,
      action: PayloadAction<{
        data: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { data, currentPage, totalPages } = action.payload;

      state.productRec.pagination.loading = false;
      state.productRec.pagination.currentPage = currentPage;
      state.productRec.pagination.totalPages = totalPages;

      if (currentPage === 1) {
        state.productRec.data = data;
      } else {
        const existingPosts = state.productRec.data.map(
          (product) => product.id
        );
        const nowNot = data.filter(
          (product) => !existingPosts.includes(product.id)
        );
        state.productRec.data = [...state.productRec.data, ...nowNot];
      }

      state.productRec.pagination.hasMore = currentPage < totalPages;
    },
    setLoadingPostRec(state, action: PayloadAction<boolean>) {
      state.postRec.pagination.loading = action.payload;
    },
    setLoadingProductRec(state, action: PayloadAction<boolean>) {
      state.productRec.pagination.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getRecPostById = createAction(
  `${name}/GET_REC_POST_BY_USERID`,
  (pageNum: any, userId: string) => ({
    payload: { pageNum, userId },
  })
);

// selectors
export const selectState = (state: any) => state[name];
export const selectPostRec = createSelector(
  selectState,
  (state) => state.postRec.data
);
export const selectProductRec = createSelector(
  selectState,
  (state) => state.productRec.data
);
export const selectPostRecPagination = createSelector(
  selectState,
  (state) => state.postRec.pagination
);
export const selectProductRecPagination = createSelector(
  selectState,
  (state) => state.productRec.pagination
);

export const { actions } = adminSlice;
export default adminSlice;
