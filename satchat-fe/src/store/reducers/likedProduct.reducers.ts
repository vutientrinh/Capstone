import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "likedProduct";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  likedProducts: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
};

const likedProductSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setLikedProducts: (
      state,
      action: PayloadAction<{
        likedProducts: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      const { likedProducts, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.likedProducts = likedProducts;
      } else {
        state.likedProducts = [...state.likedProducts, ...likedProducts];
      }

      state.hasMore = currentPage < totalPages;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setUnlikedProduct(state, action: PayloadAction<any>) {
      const { productId } = action.payload;
      const index = state.likedProducts.findIndex(
        (product) => product.id === productId
      );
      if (index !== -1) {
        state.likedProducts.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

//actions
export const getLikedProducts = createAction(
  `${name}/GET_LIKED_PRODUCTS`,
  (pageNum: any) => ({
    payload: { pageNum },
  })
);

//selectors
export const selectState = (state: any) => state[name];

export const selectLikedProducts = createSelector(
  selectState,
  (state) => state.likedProducts
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

export const { actions } = likedProductSlice;
export default likedProductSlice;
