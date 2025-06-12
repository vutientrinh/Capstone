import { IMGAES_URL } from "@/global-config";
import { useState } from "react";
import { TrackingPopup } from "@/components/tracking-popup";
import { useTranslation } from "react-i18next";

export const TrackingCard = ({
  order,
  handleCancelOrder,
  handleTabChange,
}: {
  order: any;
  handleCancelOrder: (orderId: any) => void;
  handleTabChange: (tab: string) => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 shadow-sm mb-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[var(--background-component)]">
          <div className="flex items-center">
            <span className="font-medium text-[#ee4d2d] mr-2">
              {t("tracking.donHang")}
            </span>
            <span className="text-[var(--foreground)]">{order.id}</span>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === "SHIPPED"
                ? "bg-blue-100 text-blue-800"
                : order.status === "DELIVERED"
                ? "bg-green-100 text-green-800"
                : order.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {convertOrderStatus(order.status)}
          </div>
        </div>
        <div className="p-4">
          {order.items.map((item: any, index: any) => (
            <div
              key={index}
              className="flex items-start gap-4 mb-4 last:mb-0 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-shrink-0">
                <img
                  src={IMGAES_URL + item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-[var(--foreground)]">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t("tracking.soLuong")}: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center p-4 bg-[var(--background-component)] border-t border-gray-200">
          <div className="text-sm">
            <div className="flex items-center text-[var(--foreground)]">
              <span className="mr-2">GHN -</span>
              <span className="font-medium">
                {order.shippingInfo.ghnOrderCode}
              </span>
            </div>
            <div className="text-[var(--foreground)] mt-1">
              {t("tracking.ngayDat")}:{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-bold text-lg text-[var(--foreground)] mb-2">
              {formatPrice(order.payment.amountPaid)}
            </div>
            <button
              onClick={() => {
                setOpen(true);
                setSelectedOrder(order);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200"
            >
              {t("tracking.xemChiTiet")}
            </button>
          </div>
        </div>
      </div>

      {open && selectedOrder && (
        <TrackingPopup
          mock_order={selectedOrder}
          display={open}
          setDisplay={setOpen}
          handleCancelOrder={handleCancelOrder}
          handleTabChange={handleTabChange}
        />
      )}
    </>
  );
};
