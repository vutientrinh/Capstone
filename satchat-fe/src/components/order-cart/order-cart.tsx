import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import {
  Check,
  ChevronRight,
  CreditCard,
  Info,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addressStore,
  cartStore,
  commonStore,
  profileStore,
} from "@/store/reducers";
import { GHN_SHOPID, IMGAES_URL } from "@/global-config";
import backendClient from "@/utils/BackendClient";
import { AddressFormData } from "@/interfaces/IAddress";
import { useTranslation } from "react-i18next";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
};

type ShippingOption = {
  id: string;
  name: string;
  price?: number;
  minWeight: number;
  maxWeight?: number;
  days?: string;
  options: string;
  service_id: number;
  service_type_id?: number;
  minAmount?: number;
  selected: boolean;
  disabled?: boolean;
};

type PaymentMethod = {
  id: string;
  name: string;
  selected: boolean;
};

export const OrderCart = ({
  onUpdateQuantity,
  onRemoveItem,
}: {
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  // toggle dialog
  const toggleDialog = () => setOpen((prev) => !prev);
  const cartItems = useSelector(cartStore.selectcartItems);
  const currentUser = useSelector(profileStore.selectCurrentUser);

  // Get addresses from store
  const addresses = useSelector(addressStore.selectAddresses);
  const loading = useSelector(addressStore.selectLoading);
  const hasMore = useSelector(addressStore.selectHasMore);
  const currentPage = useSelector(addressStore.selectCurrentPage);

  // Shipping states
  const [shippingFee, setShippingFee] = useState(0);
  const shippingInfo = useSelector(addressStore.selectDefaultAddress);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([
    {
      id: "light",
      name: "Hàng nhẹ",
      minWeight: 0,
      maxWeight: 50000,
      options: "Tối đa 50kg",
      selected: true,
      service_id: 53321,
      service_type_id: 2,
    },
    {
      id: "heavy",
      name: "Hàng nặng",
      minWeight: 50000,

      options: "Trên 50kg",
      selected: false,
      service_id: 53321,
      service_type_id: 2,
    },
  ]);

  useEffect(() => {
    if (!currentUser) return;
    dispatch(cartStore.getCartItems(currentUser?.id));
    dispatch(addressStore.getAllAddresses(currentPage));

    // Scroll hide/show button
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentUser?.id, currentPage, dispatch]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "COD", name: "Cash on Delivery", selected: true },
    { id: "VNPAY", name: "VNPay", selected: false },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });

  const [summary, setSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 30000,
    discount: 0,
    total: 0,
  } as any);

  // Calculate total weight of items in cart
  const calculateWeightItems = (items: any) => {
    const totalWeight = items.reduce((acc: number, item: any) => {
      const weight = item.product.weight || 0;
      return acc + weight * item.quantity;
    }, 0);
    return totalWeight;
  };

  // Automatically select shipping option based on weight
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setShippingFee(0);
      return;
    }
    const weight = calculateWeightItems(cartItems);
    // Auto-select shipping option based on weight
    const updatedOptions = shippingOptions.map((option) => {
      if (option.id === "light" && weight <= 50000) {
        return { ...option, selected: true };
      } else if (option.id === "heavy" && weight > 50000) {
        return { ...option, selected: true };
      } else {
        return { ...option, selected: false };
      }
    });

    setShippingOptions(updatedOptions);

    // Recalculate shipping fee when weight changes
    const selectedOption = updatedOptions.find((option) => option.selected);
    if (selectedOption && shippingInfo) {
      calculateShipping(selectedOption);
    }
  }, [cartItems, shippingInfo]);

  // Calculate shipping fee based on selected option and address
  const calculateShipping = async (selectedShipping: any) => {
    if (!shippingInfo || cartItems.length === 0) {
      setShippingFee(0);
      return;
    }

    const weight_items = calculateWeightItems(cartItems);
    if (weight_items <= 0) return;

    const request: any = {
      shop_id: GHN_SHOPID,
      service_id: selectedShipping.service_id,
      service_type_id: selectedShipping.service_type_id,
      to_ward_code: shippingInfo.wardCode,
      to_district_id: shippingInfo.districtId,
      weight: Math.ceil(weight_items),
    };

    // fetching API
    try {
      const respone: any = await backendClient.shippingFee(request);
      const { data } = respone.data;
      if (!data) {
        return;
      }
      setShippingFee(data.total);
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
    }
  };

  // Calculate summary based on current state
  const calculateSummary = () => {
    const subtotal = cartItems.reduce(
      (sum: any, item: any) => sum + item.price * item.quantity,
      0
    );

    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const total = subtotal + tax + shippingFee;

    return {
      subtotal,
      tax,
      shipping: shippingFee,
      discount,
      total,
    };
  };

  // Update summary when relevant data changes
  useEffect(() => {
    const summaryValues = calculateSummary();
    setSummary(summaryValues);
  }, [cartItems, shippingFee, promoApplied]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (
    productId: string,
    price: number,
    quantity: number
  ) => {
    try {
      const payload = {
        userId: currentUser?.id,
        productId,
        price,
        quantity,
      };
      const response: any = await backendClient.addToCart(payload);
      if (!response?.data) {
        return;
      }
      const result = response?.data.data;
      dispatch(cartStore.actions.setCart(result));

      // Shipping and summary will be recalculated via useEffect
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const handleSetDefaultAddress = async (addressId: any) => {
    try {
      const response: any = await backendClient.setDefaultAddress(addressId);
      const { data: addr } = response.data;
      dispatch(addressStore.actions.updateDefaultAddress(addr.id));

      // Recalculate shipping when address changes
      const selectedOption = shippingOptions.find((option) => option.selected);
      if (selectedOption) {
        calculateShipping(selectedOption);
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: any) => {
    try {
      const response: any = await backendClient.deleteAddress(addressId);
      if (!response?.data) {
        return;
      }
      dispatch(commonStore.actions.setSuccessMessage("Xóa địa chỉ thành công"));
      dispatch(addressStore.actions.deleteAddress(addressId));
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (onRemoveItem) {
      onRemoveItem(id);
    }
  };

  const handleTestCreateOrder = async () => {
    if (!currentUser) return;
    if (cartItems.length === 0) return;
    if (!shippingInfo) {
      dispatch(commonStore.actions.setErrorMessage("Vui lòng chọn địa chỉ"));
      return;
    }

    try {
      const payload = {
        customerId: currentUser?.id,
        items: cartItems.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingInfo: {
          receiverName:
            shippingInfo?.user?.firstName + " " + shippingInfo?.user?.lastName,
          receiverPhone: shippingInfo?.phone,
          address: shippingInfo?.address,
          wardCode: shippingInfo?.wardCode,
          districtId: shippingInfo?.districtId,
          shippingFee: shippingFee,
          serviceId: shippingOptions.find((option) => option.selected)
            ?.service_id,
          serviceTypeId: shippingOptions.find((option) => option.selected)
            ?.service_type_id,
          weight: calculateWeightItems(cartItems),
        },
        payment: {
          method: paymentMethods.find((method) => method.selected)?.id,
          amountPaid: summary.total,
        },
      };
      const response: any = await backendClient.createOrder(payload);
      if (!response?.data) {
        return;
      }
      const { data } = response.data;
      if (paymentMethods.find((method) => method.selected)?.id === "VNPAY") {
        const redirectUrl = data;
        window.open(redirectUrl, "_blank");
      }

      // clear cart
      const clearCart: any = await backendClient.clearCart(currentUser?.id);
      if (clearCart?.data) {
        dispatch(cartStore.actions.clearCart(currentUser?.id));
        dispatch(commonStore.actions.setSuccessMessage("Đặt hàng thành công!"));
        toggleDialog();
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const handlePaymentChange = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({ ...method, selected: method.id === id }))
    );
  };

  // Handle promo code application
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true);
      setPromoMessage({
        text: "10% discount applied successfully!",
        type: "success",
      });
    } else {
      setPromoApplied(false);
      setPromoMessage({
        text: "Invalid promo code",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-15 right-4 z-[1400] rounded-full p-1 bg-black ">
        <IconButton size="small" onClick={toggleDialog}>
          <ShoppingCart className="w-5 h-5 text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {cartItems.length}
            </span>
          )}
        </IconButton>
      </div>

      {/* Right-side Dialog */}
      <Dialog
        open={open}
        onClose={toggleDialog}
        keepMounted
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-end",
            alignItems: "stretch",
          },
          "& .MuiPaper-root": {
            margin: 0,
            borderRadius: "0px 0px 0px 8px",
            height: "100vh",
            maxHeight: "100vh",
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              🛒
              {t("marketplace.orderSummary")}
            </h2>
            <span className="text-sm text-gray-500">
              {cartItems.length} items
            </span>
          </div>
        </DialogTitle>
        <DialogContent>
          {/* Cart Items */}
          <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
            {cartItems.map((item: any, index: number) => (
              <div key={index} className="flex border-b border-gray-100 pb-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={IMGAES_URL + item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex border border-gray-200 rounded-md">
                      <button
                        className="px-2 py-1 border-r border-gray-200 text-gray-500 hover:bg-gray-50"
                        onClick={() => {
                          handleQuantityChange(item.product.id, item.price, -1);
                        }}
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border-l border-gray-200 text-gray-500 hover:bg-gray-50"
                        onClick={() =>
                          handleQuantityChange(item.product.id, item.price, 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          {/* <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Apply
              </button>
            </div>
            {promoMessage.text && (
              <p
                className={`text-xs mt-1 ${
                  promoMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {promoMessage.text}
              </p>
            )}
          </div> */}
          {/* Address options */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700 mb-2">
                {t("marketplace.address")}
              </h3>
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => {
                  dispatch(addressStore.actions.setIsOpen(true));
                }}
              >
                {t("marketplace.addAddress")}
              </button>
            </div>

            {/* lst Address */}
            {addresses.map((address: any) => (
              <div
                key={address.id}
                className="space-y-2 border border-gray-200 rounded-md hover:shadow-sm transition mb-2 p-4"
              >
                <div className="mb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1">
                      <div className="font-medium after:content-['|'] after:mx-2 after:text-gray-400">
                        {address?.user.firstName} {address?.user.lastName}
                      </div>
                      <div className="text-gray-600">{address.phone}</div>
                    </div>
                    {address.isDefault && (
                      <span className="bg-red-100 text-red-600 text-xs py-1 px-2 rounded-md border border-red-200">
                        {t("marketplace.default")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-gray-700">
                  {address.address}
                  <div>
                    {address.wardName}, {address.districtName},{" "}
                    {address.provinceName}
                  </div>
                </div>

                {!address.isDefault && (
                  <div className="mt-3 flex justify-start gap-2">
                    {/* Nút thiết lập mặc định */}
                    <button
                      className="inline-flex items-center px-3 py-1 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      {t("marketplace.setDefault")}
                    </button>

                    {/* Nút xóa */}
                    <button
                      className="inline-flex items-center px-3 py-1 text-sm border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
                      onClick={() => {
                        handleDeleteAddress(address.id);
                      }}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {t("marketplace.delete")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Shipping Options */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">
              {t("marketplace.shippingOptions")}
            </h3>
            <div className="space-y-2">
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center justify-between border p-3 rounded-md 
                    ${
                      option.selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Truck size={18} />
                    <div>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-xs text-gray-500">{option.options}</p>
                    </div>
                  </div>
                  {option.selected && (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center border-blue-500 bg-blue-500">
                        <Check size={12} className="text-white" />
                      </div>
                      <p className="text-sm mt-1">
                        {formatPrice(option.selected ? shippingFee : 0)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              Phương thức vận chuyển được tự động chọn dựa trên trọng lượng đơn
              hàng
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">
              {t("marketplace.paymentMethod")}
            </h3>

            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-md p-3 flex items-center cursor-pointer ${
                    method.selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handlePaymentChange(method.id)}
                >
                  <div className="flex-1 flex items-center">
                    <CreditCard size={16} className="mr-2 text-gray-600" />
                    <span className="font-medium">{method.name}</span>
                  </div>

                  <div className="ml-4">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        method.selected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {method.selected && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t("marketplace.subTotal")}</span>
              <span>{formatPrice(summary.subtotal)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t("marketplace.shipping")}</span>
              <span>
                {summary.shipping === 0 ? "0" : formatPrice(summary.shipping)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">VAT (8%)</span>
              <span>{formatPrice(summary.tax)}</span>
            </div>

            {summary.discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(summary.discount)}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-gray-200 mt-2 pt-2 font-bold">
              <span>{t("marketplace.total")}</span>
              <span>{formatPrice(summary.total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center"
            onClick={handleTestCreateOrder}
          >
            {t("marketplace.placeOrder")}
            <ChevronRight size={16} className="ml-1" />
          </button>

          {/* Additional Information */}
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <Info size={14} className="mr-1" />
            <span>Your order information is secure and encrypted</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
