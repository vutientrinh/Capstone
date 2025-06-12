import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AddressFormData } from "@/interfaces/IAddress";

const name = "address";
export const resetState = createAction(`${name}/RESET_STATE`);
const initialState = {
  addresses: [] as AddressFormData[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
  // info giaohangnhanh
  provinces: [] as any[],
  districts: [] as any[],
  wards: [] as any[],
  // address popup
  isOpen: false,
  defaultAddress: {} as AddressFormData,
};

const addressSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setAddresses: (
      state,
      action: PayloadAction<{
        addresses: AddressFormData[];
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      const { addresses, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.addresses = addresses;
      } else {
        state.addresses = [...state.addresses, ...addresses];
      }

      state.hasMore = currentPage < totalPages;

      // set default address
      const defaultAddress = state.addresses.find(
        (address: any) => address.isDefault
      );
      if (defaultAddress) {
        state.defaultAddress = defaultAddress;
      }
    },
    addAddress: (state, action: PayloadAction<AddressFormData>) => {
      const newAddress = action.payload;
      state.addresses = [...state.addresses, newAddress];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setProvinces: (state, action: PayloadAction<{ provinces: any[] }>) => {
      const { provinces } = action.payload;
      state.provinces = provinces;
    },
    setDistricts: (state, action: PayloadAction<{ districts: any[] }>) => {
      const { districts } = action.payload;
      state.districts = districts;
    },
    setWards: (state, action: PayloadAction<{ wards: any[] }>) => {
      const { wards } = action.payload;
      state.wards = wards;
    },
    updateDefaultAddress: (
      state,
      action: PayloadAction<{ addressId: string }>
    ) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map((address: any) => ({
        ...address,
        isDefault: address.id === addressId,
      }));

      // set default address
      const defaultAddress = state.addresses.find(
        (address: any) => address.id === addressId
      );
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      const addressId = action.payload;
      return {
        ...state,
        addresses: state.addresses.filter(
          (address: any) => address.id !== addressId
        ),
      };
    },
    setDefaultAddress: (
      state,
      action: PayloadAction<AddressFormData | null>
    ) => {
      const defaultAddress = action.payload;
      state.defaultAddress = defaultAddress || ({} as AddressFormData);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getAllAddresses = createAction(
  `${name}/GET_ALL_ADDRESSES`,
  (pageNum: any) => ({
    payload: { pageNum },
  })
);
export const getProvinces = createAction(`${name}/GET_PROVINCES`);
export const getDistricts = createAction(
  `${name}/GET_DISTRICTS`,
  (provinceId: any) => ({
    payload: { provinceId },
  })
);
export const getWards = createAction(
  `${name}/GET_WARDS`,
  (districtId: any) => ({
    payload: { districtId },
  })
);
// selectors
export const selectState = (state: any) => state[name];
export const selectAddresses = createSelector(
  selectState,
  (state) => state.addresses
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
export const selectIsOpen = createSelector(
  selectState,
  (state) => state.isOpen
);
export const selectProvinces = createSelector(
  selectState,
  (state) => state.provinces
);
export const selectDistricts = createSelector(
  selectState,
  (state) => state.districts
);
export const selectWards = createSelector(selectState, (state) => state.wards);
export const selectDefaultAddress = createSelector(
  selectState,
  (state) => state.defaultAddress
);

export const { actions } = addressSlice;
export default addressSlice;
