import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "cart";
export const resetState = createAction(`${name}/RESET_STATE`);
interface cartItems {
  product: any;
  price: number;
  quantity: number;
}
interface ShippingInfo {
  receiverName: string;
  receiverPhone: string;
  address: string;
  wardCode: string;
  districtId: number;
}
interface Payment {
  method: string;
}
const initialState = {
  // Cart
  cartItems: [] as cartItems[],
  shippingInfo: null as ShippingInfo | null,
  payment: null as Payment | null,
};

const cartSlice = createSlice({
  name,
  initialState,
  reducers: {
    // cart
    setCart: (state, action: PayloadAction<cartItems[]>) => {
      state.cartItems = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = initialState.cartItems;
    },
    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    clearShippingInfo: (state) => {
      state.shippingInfo = initialState.shippingInfo;
    },
    setPayment: (state, action: PayloadAction<Payment>) => {
      state.payment = action.payload;
    },
    clearPayment: (state) => {
      state.payment = initialState.payment;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getCartItems = createAction(
  `${name}/GET_CART_ITEMS`,
  (userId: string) => ({
    payload: { userId },
  })
);

//selectors
export const selectState = (state: any) => state[name];

// cart
export const selectcartItems = createSelector(
  selectState,
  (state) => state.cartItems
);
export const selectShippingInfo = createSelector(
  selectState,
  (state) => state.shippingInfo
);
export const selectPayment = createSelector(
  selectState,
  (state) => state.payment
);

export const { actions } = cartSlice;
export default cartSlice;
