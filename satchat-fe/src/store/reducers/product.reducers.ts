import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "product";
export const resetState = createAction(`${name}/RESET_STATE`);
interface Filter {
  filters: {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    rating: number; // 0-5 (0 = all)
    inStock: boolean;
  };
  sort: {
    field: string;
    direction: string; // asc or desc
  };
}
const initialState = {
  products: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
  // Product detail
  product: null as any,
  // Filter
  filter: null as Filter | null,
  // Show quick view
  showQuickView: false,
};

const productSlice = createSlice({
  name,
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{
        products: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      const { products, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.products = products;
      } else {
        state.products = [...state.products, ...products];
      }

      state.hasMore = currentPage < totalPages;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setProductsList: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    setProductDetail: (state, action) => {
      state.product = action.payload;
    },
    // filter
    setFilter(state, action: PayloadAction<Filter | null>) {
      if (action.payload) {
        const { filters, sort } = action.payload;
        state.filter = {
          filters: { ...filters },
          sort: { ...sort },
        };
      } else {
        state.filter = initialState.filter; // fallback
      }
      // Reset other states to default
      state.currentPage = initialState.currentPage;
      state.products = initialState.products;
      state.hasMore = initialState.hasMore;
      state.loading = initialState.loading;
      state.totalPages = initialState.totalPages;
    },

    resetFilter(state) {
      state.filter = initialState.filter;
      state.currentPage = initialState.currentPage;
      state.products = initialState.products;
      state.hasMore = initialState.hasMore;
      state.loading = initialState.loading;
      state.totalPages = initialState.totalPages;
    },
    // show quick view
    setShowQuickView(state, action: PayloadAction<boolean>) {
      state.showQuickView = action.payload;
    },
    // state product detail
    addProductComment(state, action: PayloadAction<any>) {
      // UPDATE: product amountRating (list products)
      const { productId, comment } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.amountRating = product.amountRating + 1;
        // recalculate rating
        const totalRating = product.rating * (product.amountRating - 1);
        product.rating = (totalRating + comment.rating) / product.amountRating;
      }

      // UPDATE: product detail
      if (state.product && state.product.id === productId) {
        state.product.amountRating = state.product.amountRating + 1;
        const totalRating =
          state.product.rating * (state.product.amountRating - 1);
        state.product.rating =
          (totalRating + comment.rating) / state.product.amountRating;
      }
    },
    setLikedProduct(state, action: PayloadAction<any>) {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.isLiked = true;
      }
      // UPDATE: product detail
      if (state.product && state.product.id === productId) {
        state.product.isLiked = true;
      }
    },
    setUnlikedProduct(state, action: PayloadAction<any>) {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.isLiked = false;
      }
      // UPDATE: product detail
      if (state.product && state.product.id === productId) {
        state.product.isLiked = false;
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
export const getProducts = createAction(
  `${name}/GET_PRODUCTS`,
  (pageNum: any, filter: Filter, isDefault: boolean) => ({
    payload: { pageNum, filter, isDefault },
  })
);

//selectors
export const selectState = (state: any) => state[name];

export const selectProducts = createSelector(
  selectState,
  (state) => state.products
);
export const selectProductDetail = createSelector(
  selectState,
  (state) => state.product
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

//filter
export const selectFilter = createSelector(
  selectState,
  (state) => state.filter
);

// reset quick view
export const selectShowQuickView = createSelector(
  selectState,
  (state) => state.showQuickView
);

export const { actions } = productSlice;
export default productSlice;
