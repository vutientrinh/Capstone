import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  ArrowRight,
  Clock,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { IMGAES_URL } from "@/global-config";
import { endpoints } from "@/utils/endpoints";

export enum ShippingStatus {
  PENDING = "PENDING",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export default function OrderManagement() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<any | null>({});
  const [page, setPage] = useState<any | null>(1);
  const [orderStatuses, setOrderStatuses] = useState<any | null>({});
  const [isStatusUpdating, setIsStatusUpdating] = useState<any | null>({});
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response: any = await backendClient.getOrders(page);
        if (response) {
          const result = response.data;
          setOrders(result);
          setPage(result.currentPage);
        }
      } catch (error) {
        dispatch(
          commonStore.actions.setErrorMessage(
            "Lỗi hệ thống! Vui lòng thử lại sau."
          )
        );
      }
    };

    fetchOrders();
  }, [page]);

  const handleStatusChange = (orderId: any, newStatus: any) => {
    setOrderStatuses((prev: any) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: any) => {
    setIsStatusUpdating((prev: any) => ({
      ...prev,
      [orderId]: true,
    }));

    console.log("Updating status for order:", orderId);
    console.log("New status:", orderStatuses[orderId]);
    try {
      const response: any = await backendClient.setShippingStatus(
        orderId,
        orderStatuses[orderId]
      );

      console.log("Response:", response);
      if (response) {
        const result = response.data;
        setOrders((prevOrders: any) => ({
          ...prevOrders,
          data: prevOrders.data.map((order: any) =>
            order.id === result.id ? result : order
          ),
        }));

        dispatch(
          commonStore.actions.setSuccessMessage(
            `Cập nhật trạng thái đơn hàng ${
              orders?.data?.find((o: any) => o.id === orderId)?.orderCode
            } thành công!`
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(
        commonStore.actions.setErrorMessage(
          "Lỗi hệ thống! Vui lòng thử lại sau."
        )
      );
    } finally {
      setIsStatusUpdating((prev: any) => ({
        ...prev,
        [orderId]: false,
      }));
    }
  };

  // Hàm lọc đơn hàng theo trạng thái
  const filterOrders = () => {
    if (selectedFilter === "all") return orders.data;
    return orders.data.filter(
      (order: any) =>
        order.status.toLowerCase() === selectedFilter.toLowerCase()
    );
  };

  // Hàm tìm kiếm đơn hàng
  const searchOrders = () => {
    if (!searchTerm) return filterOrders();
    const term = searchTerm.toLowerCase();
    return filterOrders().filter(
      (order: any) =>
        order.orderCode.toLowerCase().includes(term) ||
        order.customer.firstName.toLowerCase().includes(term) ||
        order.customer.lastName.toLowerCase().includes(term) ||
        `${order.customer.firstName} ${order.customer.lastName}`
          .toLowerCase()
          .includes(term)
    );
  };

  // Định dạng tiền VND
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Định dạng ngày tháng
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Component hiển thị trạng thái đơn hàng
  const StatusBadge = ({ status }: { status: any }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";
    let icon = null;

    switch (status.toUpperCase()) {
      case "PENDING":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <Clock size={16} className="mr-1" />;
        status = "Chờ xử lý";
        break;
      case "PROCESSING":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <RefreshCw size={16} className="mr-1" />;
        status = "Đang xử lý";
        break;
      case "DELIVERED":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <Check size={16} className="mr-1" />;
        status = "Đã giao hàng";
        break;
      case "FAILED":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        icon = <X size={16} className="mr-1" />;
        status = "Thất bại";
        break;
      case "PAID":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <Check size={16} className="mr-1" />;
        status = "Đã thanh toán";
        break;
      default:
        icon = <AlertCircle size={16} className="mr-1" />;
    }

    return (
      <span
        className={`flex items-center px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs font-medium`}
      >
        {icon}
        {status}
      </span>
    );
  };

  const ShippingStatusOptions = [
    { value: ShippingStatus.PENDING, label: "Chờ xác nhận" },
    { value: ShippingStatus.PICKED_UP, label: "Đã lấy hàng" },
    { value: ShippingStatus.IN_TRANSIT, label: "Đang vận chuyển" },
    { value: ShippingStatus.DELIVERED, label: "Đã giao hàng" },
    { value: ShippingStatus.FAILED, label: "Giao hàng thất bại" },
  ];

  const displayedOrders = searchOrders();

  const handlePrintA5 = async (orderCode: string) => {
    try {
      const response: any = await backendClient.getTokenPrint(orderCode);
      if (!response.data) {
        return;
      }

      const result = response.data;
      let token = result.data.token;
      let url = endpoints.order.printPDF.replace("{token}", token);

      // forward to the new page
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error printing A5 invoice:", error);
      dispatch(
        commonStore.actions.setErrorMessage(
          "Lỗi hệ thống! Vui lòng thử lại sau."
        )
      );
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header>
        <div className="py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedFilter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setSelectedFilter("shipped")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedFilter === "processing"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => setSelectedFilter("delivered")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedFilter === "delivered"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Đã giao
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Tìm theo mã hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Order list */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="col-span-2">Mã đơn hàng</div>
              <div className="col-span-3">Khách hàng</div>
              <div className="col-span-2">Ngày đặt</div>
              <div className="col-span-2">Tổng tiền</div>
              <div className="col-span-2">Trạng thái</div>
              <div className="col-span-1">Chi tiết</div>
            </div>

            {displayedOrders?.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Không tìm thấy đơn hàng nào
              </div>
            ) : (
              <div>
                {displayedOrders?.map((order: any) => (
                  <div
                    key={order.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <div
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpandedOrderId(
                          expandedOrderId === order.id ? null : order.id
                        )
                      }
                    >
                      <div className="md:col-span-2 flex flex-col">
                        <span className="font-medium text-gray-900">
                          {order.orderCode}
                        </span>
                        <span className="md:hidden text-xs text-gray-500 mt-1">
                          Mã đơn hàng
                        </span>
                      </div>

                      <div className="md:col-span-3 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 mr-3">
                          {order.customer.avatar ? (
                            <img
                              src={IMGAES_URL + order.customer.avatar}
                              alt={`${order.customer.firstName} ${order.customer.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white">
                              {order.customer.firstName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {order.customer.firstName} {order.customer.lastName}
                          </span>
                          <span className="md:hidden block text-xs text-gray-500 mt-1">
                            Khách hàng
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-2 flex flex-col">
                        <span className="text-gray-900">
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="md:hidden text-xs text-gray-500 mt-1">
                          Ngày đặt
                        </span>
                      </div>

                      <div className="md:col-span-2 flex flex-col">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(
                            order.totalAmount + order.shippingFee
                          )}
                        </span>
                        <span className="md:hidden text-xs text-gray-500 mt-1">
                          Tổng tiền
                        </span>
                      </div>

                      <div className="md:col-span-2 flex flex-col">
                        <StatusBadge status={order.status} />
                        <span className="md:hidden text-xs text-gray-500 mt-1">
                          Trạng thái
                        </span>
                      </div>

                      <div className="md:col-span-1 flex items-center justify-end">
                        {expandedOrderId === order.id ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedOrderId === order.id && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                              Thông tin đơn hàng
                            </h3>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-gray-500">
                                  Mã đơn hàng:
                                </div>
                                <div className="font-medium text-gray-900">
                                  {order.orderCode}
                                </div>

                                <div className="text-gray-500">
                                  Ngày đặt hàng:
                                </div>
                                <div className="font-medium text-gray-900">
                                  {formatDate(order.createdAt)}
                                </div>

                                <div className="text-gray-500">Trạng thái:</div>
                                <div>
                                  <StatusBadge status={order.status} />
                                </div>

                                <div className="text-gray-500">
                                  Phương thức thanh toán:
                                </div>
                                <div className="font-medium text-gray-900">
                                  {order.payment.method === "VNPAY"
                                    ? "VNPay"
                                    : order.payment.method === "CASH"
                                    ? "Tiền mặt"
                                    : order.payment.method === "BANK_TRANSFER"
                                    ? "Chuyển khoản"
                                    : order.payment.method}
                                </div>

                                <div className="text-gray-500">
                                  Trạng thái thanh toán:
                                </div>
                                <div>
                                  <StatusBadge status={order.payment.status} />
                                </div>
                              </div>
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3">
                              Thông tin sản phẩm
                            </h3>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                              {order.items.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between border-b border-gray-100 py-3 last:border-b-0 last:pb-0 first:pt-0"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {item.product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      SL: {item.quantity} x{" "}
                                      {formatCurrency(item.price)}
                                    </p>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <p className="font-medium text-gray-900">
                                      {formatCurrency(item.total)}
                                    </p>
                                  </div>
                                </div>
                              ))}

                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    Tạm tính:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(order.totalAmount)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                  <span className="text-gray-500">
                                    Phí vận chuyển:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(order.shippingFee)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                  <span className="text-gray-500">VAT 8%:</span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(order.totalAmount * 0.08)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-base mt-2 pt-2 border-t border-gray-100">
                                  <span className="font-medium text-gray-800">
                                    Tổng cộng:
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    {formatCurrency(
                                      order.totalAmount +
                                        order.shippingFee +
                                        order.totalAmount * 0.08
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                              Thông tin giao hàng
                            </h3>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                              <div className="grid grid-cols-1 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Người nhận:
                                  </span>
                                  <span className="font-medium text-gray-900 ml-2">
                                    {order.shippingInfo.receiverName}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-gray-500">
                                    Số điện thoại:
                                  </span>
                                  <span className="font-medium text-gray-900 ml-2">
                                    {order.shippingInfo.receiverPhone}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-gray-500">
                                    Địa chỉ:
                                  </span>
                                  <span className="font-medium text-gray-900 ml-2">
                                    {order.shippingInfo.address}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-gray-500">
                                    Mã vận đơn:
                                  </span>
                                  <span className="font-medium text-gray-900 ml-2">
                                    {order.shippingInfo.ghnOrderCode}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-gray-500">
                                    Trạng thái vận chuyển:
                                  </span>
                                  <div className="inline-block ml-2">
                                    <StatusBadge
                                      status={order.shippingInfo.shippingStatus}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <span className="text-gray-500">
                                    Ngày giao dự kiến:
                                  </span>
                                  <span className="font-medium text-gray-900 ml-2">
                                    {formatDate(
                                      order.shippingInfo.estimatedDeliveryDate
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3">
                              Thao tác
                            </h3>
                            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-3">
                              <div className="flex gap-2 items-center flex-wrap">
                                <div className="flex-1 min-w-fit">
                                  <select
                                    value={
                                      orderStatuses[order.id] || order.status
                                    }
                                    onChange={(e) =>
                                      handleStatusChange(
                                        order.id,
                                        e.target.value
                                      )
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                  >
                                    {ShippingStatusOptions.map((status) => (
                                      <option
                                        key={status.value}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  onClick={() => handleUpdateStatus(order.id)}
                                  disabled={
                                    isStatusUpdating[order.id] ||
                                    orderStatuses[order.id] === order.status ||
                                    !orderStatuses[order.id]
                                  }
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isStatusUpdating[order.id] ? (
                                    <>
                                      <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                      />
                                      Đang cập nhật...
                                    </>
                                  ) : (
                                    "Cập nhật trạng thái"
                                  )}
                                </button>
                              </div>
                              <button
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => handlePrintA5(order?.orderCode)}
                              >
                                In hoá đơn
                              </button>
                              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Liên hệ khách hàng
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{displayedOrders?.length}</span> /{" "}
              <span className="font-medium">{orders?.data?.length}</span> đơn
              hàng
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev: any) => prev - 1)}
                className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                disabled={page === orders?.totalPages}
                onClick={() => setPage((prev: any) => prev + 1)}
                className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
