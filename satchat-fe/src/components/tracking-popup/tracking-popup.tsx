import { IMGAES_URL } from "@/global-config";
import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Dialog, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export const TrackingPopup = ({
  mock_order,
  display,
  setDisplay,
  handleCancelOrder,
  handleTabChange,
}: {
  mock_order?: any;
  display: boolean;
  setDisplay: (value: boolean) => void;
  handleCancelOrder: (orderId: any) => void;
  handleTabChange: (tab: string) => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const convertOrderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "SHIPPED":
        return "Đã giao cho đơn vị vận chuyển";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      case "FAILED":
        return "Không thành công";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const convertShippingStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "PICKED_UP":
        return "Đã lấy hàng";
      case "IN_TRANSIT":
        return "Đang vận chuyển";
      case "DELIVERED":
        return "Đã giao hàng";
      case "FAILED":
        return "Không thành công";
      default:
        return "Chờ xử lý";
    }
  };

  const getServiceAvailable = (serviceId: string) => {
    switch (serviceId) {
      case "53321":
        return "Hàng nhẹ (dưới 50kg)";
      default:
        return "Hàng nặng (trên 50kg)";
    }
  };

  const paymentMethod = (method: string) => {
    switch (method) {
      case "VNPAY":
        return "Thanh toán qua VNPAY";
      case "MOMO":
        return "Thanh toán qua MoMo";
      case "CASH":
        return "Thanh toán khi nhận hàng (COD)";
      default:
        return method;
    }
  };

  const shippingSteps = ["PENDING", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
  const currentStatus = mock_order.shippingInfo.shippingStatus;
  const currentStepIndex = shippingSteps.indexOf(currentStatus);
  const progressWidth = `${
    (currentStepIndex / (shippingSteps.length - 1)) * 100
  }%`;

  const handleRetryPayment = async (orderId: string) => {
    try {
      const response: any = await backendClient.rePayment(orderId);
      if (!response?.data) {
        return;
      }
      const { data } = response.data;
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Đang chuyển hướng đến cổng thanh toán. Vui lòng hoàn tất thanh toán."
        )
      );
      window.open(data, "_blank");
    } catch (error) {
      console.error("Error retrying payment:", error);
      dispatch(
        commonStore.actions.setErrorMessage(
          "Đã xảy ra lỗi khi thử thanh toán lại. Vui lòng thử lại sau."
        )
      );
    }
  };

  return (
    <Dialog
      open={display}
      onClose={() => {
        setDisplay(false);
      }}
      sx={{
        "& .MuiDialog-paper": {
          width: "1000px",
          maxWidth: "1000px",
          padding: 0,
          backgroundColor: "var(--background)",
        },
      }}
    >
      <DialogContent>
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center">
              <span className="font-bold text-red-500 mr-2">Mã đơn hàng:</span>
              <span className="text-[var(--foreground)]">{mock_order.id}</span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                mock_order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-800"
                  : mock_order.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : mock_order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {convertOrderStatus(mock_order.status)}
            </div>
          </div>

          <div className="bg-[var(--background-component)] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex flex-col items-center pb-3">
              {t("tracking.trangThaiDonHang")}
            </h3>
            <div
              className="relative flex justify-between mb-8"
              style={
                { "--progress-width": progressWidth } as React.CSSProperties
              }
            >
              {shippingSteps.map((status, index) => (
                <div
                  key={status}
                  className={`flex flex-col items-center w-1/5 relative z-10 ${
                    index <= currentStepIndex
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                      index <= currentStepIndex
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStepIndex ? "✓" : index + 1}
                  </div>
                  <div className="text-xs font-medium text-center">
                    {(() => {
                      switch (status) {
                        case "PENDING":
                          return t("tracking.chuanBiHang");
                        case "PICKED_UP":
                          return t("tracking.GHNnhanHang");
                        case "IN_TRANSIT":
                          return t("tracking.GHNvanChuyen");
                        case "DELIVERED":
                          return t("tracking.GHNthanhCong");
                        case "COMPLETED":
                          return "Hoàn thành";
                        default:
                          return status;
                      }
                    })()}
                  </div>
                </div>
              ))}

              <div className="absolute top-4 left-0 h-0.5 bg-gray-200 w-full -z-10">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-600"
                  style={{ width: progressWidth }}
                ></div>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center">
              <div className="font-medium text-blue-600 mb-2">
                <strong>
                  {convertShippingStatus(
                    mock_order.shippingInfo.shippingStatus
                  )}
                </strong>
              </div>
              <div className="text-sm text-[var(--foreground)]">
                {t("tracking.DonViVanChuyen")}:{" "}
                <span className="font-semibold">GHN</span> -{" "}
                {t("tracking.maVanDon")}:{" "}
                <span className="font-semibold">
                  {mock_order.shippingInfo.ghnOrderCode}
                </span>
              </div>
            </div>
          </div>

          {mock_order.items.length > 0 && (
            <div className="mb-6">
              {mock_order.items.map((item: any, index: any) => (
                <div
                  key={index}
                  className="flex border-b border-gray-100 py-4 last:border-0"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={
                        item.product.images.length > 0
                          ? `${IMGAES_URL}${item.product.images[0]}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="font-medium text-[var(--foreground)]">
                      {item.product.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Category: {item.product.category.name}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-gray-400">x {item.quantity}</div>
                      <div className="font-medium text-[var(--foreground)]">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-[var(--background-component)]">
              <div className="font-semibold text-[var(--foreground)] border-b border-gray-200 pb-2 mb-3">
                {t("tracking.thongTinGiaoHang")}
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <div className="w-1/3 text-gray-500 text-sm">
                    {t("tracking.nguoiNhan")}:
                  </div>
                  <div className="w-2/3 text-[var(--foreground)] font-medium">
                    {mock_order.shippingInfo.receiverName}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-gray-500 text-sm">
                    {t("tracking.sdt")}:
                  </div>
                  <div className="w-2/3 text-[var(--foreground)] font-medium">
                    {mock_order.shippingInfo.receiverPhone}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-gray-500 text-sm">
                    {t("tracking.diaChi")}:
                  </div>
                  <div className="w-2/3 text-[var(--foreground)] font-medium">
                    {mock_order.shippingInfo.address}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-gray-500 text-sm">
                    {t("tracking.phuongThucVanChuyen")}:
                  </div>
                  <div className="w-2/3 text-[var(--foreground)] font-medium">
                    GHN -{" "}
                    {getServiceAvailable(mock_order.shippingInfo.serviceId)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-[var(--background-component)]">
              <div className="font-semibold text-[var(--foreground)] border-b border-gray-200 pb-2 mb-3">
                {t("tracking.thongTinThanhToan")}
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <div className="w-1/3 text-gray-500 text-sm">
                    {t("tracking.phuongThucThanhToan")}:
                  </div>
                  <div className="w-2/3 text-[var(--foreground)] font-medium">
                    {paymentMethod(mock_order.payment.method)}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-gray-500 text-sm">
                    {t("tracking.trangThaiThanhToan")}:
                  </div>
                  <div className="w-2/3 text-[var(--foreground)] font-medium">
                    {mock_order.payment.status === "SUCCESS"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[var(--background-component)] rounded-lg p-4">
            <div className="font-semibold text-[var(--foreground)] border-b border-gray-200 pb-2 mb-3">
              {t("tracking.tongCong")}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-gray-400">{t("tracking.tamTinh")}</div>
                <div className="font-medium text-[var(--foreground)]">
                  {formatPrice(mock_order.totalAmount)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">
                  {t("tracking.phiVanChuyen")}
                </div>
                <div className="font-medium text-[var(--foreground)]">
                  {formatPrice(mock_order.shippingFee)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">VAT (8%)</div>
                <div className="font-medium text-[var(--foreground)]">
                  {formatPrice(mock_order.totalAmount * 0.08)}
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <div className="font-semibold text-gray-400">
                  {t("tracking.tongCong")}
                </div>
                <div className="font-bold text-lg text-blue-600">
                  {formatPrice(mock_order.payment.amountPaid)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200">
              {t("tracking.lienHe")}
            </button>
            {mock_order.payment.status !== "SUCCESS" &&
              mock_order.payment.method === "VNPAY" && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => {
                    handleRetryPayment(mock_order?.id);
                    setDisplay(false);
                  }}
                >
                  {t("tracking.thanhToanLai")}
                </button>
              )}
            {mock_order.status === "PENDING" &&
              mock_order.payment.status !== "SUCCESS" && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors duration-200"
                  onClick={() => {
                    handleCancelOrder(mock_order.id);
                    setDisplay(false);
                    handleTabChange("ALL");
                  }}
                >
                  {t("tracking.huyDonHang")}
                </button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
