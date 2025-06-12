import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "order";
export const resetState = createAction(`${name}/RESET_STATE`);
interface Filter {
  status: string;
  customerId: string;
}
const initialState = {
  orders: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
  // Filter
  filter: null as any | null,
};

const orderSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setOrders: (
      state,
      action: PayloadAction<{
        orders: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      const { orders, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.orders = orders;
      } else {
        state.orders = [...state.orders, ...orders];
      }

      state.hasMore = currentPage < totalPages;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilter: (state, action: PayloadAction<any>) => {
      state.filter = action.payload;
    },
    resetFilter: (state) => {
      state.filter = null;
      // set state of orders to initial state
      state.orders = initialState.orders;
      state.currentPage = initialState.currentPage;
      state.totalPages = initialState.totalPages;
      state.loading = initialState.loading;
      state.hasMore = initialState.hasMore;
    },
    updateOrder: (state, action: PayloadAction<any>) => {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const fetchOrders = createAction(
  `${name}/FETCH_ORDERS`,
  (pageNum: any, filter: Filter) => ({
    payload: { pageNum, filter },
  })
);

//selectors
export const selectState = (state: any) => state[name];
export const selectOrders = createSelector(
  selectState,
  (state) => state.orders
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
export const selectFilter = createSelector(
  selectState,
  (state) => state.filter
);
export const selectHasMore = createSelector(
  selectState,
  (state) => state.hasMore
);

export const { actions } = orderSlice;
export default orderSlice;
