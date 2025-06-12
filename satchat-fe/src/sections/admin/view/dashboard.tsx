import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Pagination } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [topSellingProducts, setTopSellingProducts] = React.useState<
    any | null
  >({});
  const [topCustomers, setTopCustomers] = React.useState<any | null>({});
  const [analysisData, setAnalysisData] = React.useState<any | null>({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backendClient.getAnalysis();
        if (response) {
          const result = response.data;
          setAnalysisData(result.data);
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
        dispatch(
          commonStore.actions.setErrorMessage(
            "Lỗi không thể lấy dữ liệu phân tích"
          )
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response: any = await backendClient.getTopSellingProducts(
          topSellingProducts?.currentPage
        );
        if (response) {
          const result = response.data;
          setTopSellingProducts(result);
        }
      } catch (error) {
        console.error("Error fetching top selling products:", error);
        dispatch(
          commonStore.actions.setErrorMessage(
            "Lỗi không thể lấy sản phẩm bán chạy nhất"
          )
        );
      }
    };

    fetchTopSellingProducts();
  }, [topSellingProducts?.currentPage]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response: any = await backendClient.getTopCustomers(
          topCustomers?.currentPage
        );
        if (response) {
          const result = response.data;
          setTopCustomers(result);
        }
      } catch (error) {
        console.error("Error fetching top selling products:", error);
        dispatch(
          commonStore.actions.setErrorMessage(
            "Lỗi không thể lấy sản phẩm bán chạy nhất"
          )
        );
      }
    };

    fetchCustomers();
  }, [topCustomers?.currentPage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Data for charts
  const orderStatusData = [
    { name: "Đã hoàn thành", value: analysisData?.orderStatus?.delivered },
    { name: "Đang giao hàng", value: analysisData?.orderStatus?.shipped },
    {
      name: "Đang chờ xác nhận",
      value: analysisData?.orderStatus?.pending,
    },
    { name: "Đã hủy đơn", value: analysisData?.orderStatus?.cancelled },
  ];

  const productStatusData = [
    { name: "Đang bán", value: analysisData?.productStatus?.selling },
    { name: "Đã ẩn", value: analysisData?.productStatus?.hidden },
    { name: "Hết hàng", value: analysisData?.productStatus?.outOfStock },
    { name: "Đã bán", value: analysisData?.productStatus?.sold },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Bảng điều khiển cửa hàng
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Tổng đơn hàng</h2>
          <p className="text-2xl font-semibold">{analysisData?.totalOrders}</p>
          <p className="text-sm text-green-600">
            Tỉ lệ thành công: {analysisData?.successRate}%
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Sản phẩm đang bán</h2>
          <p className="text-2xl font-semibold">
            {analysisData?.productStatus?.selling}
          </p>
          <p className="text-sm text-gray-600">
            Tổng số: {analysisData?.totalProducts}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Doanh thu</h2>
          <p className="text-2xl font-semibold">
            {formatPrice(analysisData?.revenue)}
          </p>
          <p className="text-sm text-gray-600">
            Từ {analysisData?.revenueGeneratingProducts} sản phẩm bán ra
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Khách hàng</h2>
          <p className="text-2xl font-semibold">
            {analysisData?.totalCustomers}
          </p>
          <p className="text-sm text-gray-600">
            Tổng số đơn hoàn thành: {analysisData?.totalCompletedOrders}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Trạng thái sản phẩm</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Top Sản Phẩm Bán Chạy</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topSellingProducts?.data?.map((product: any, index: any) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Pagination
              count={topSellingProducts.totalPages || 1}
              page={topSellingProducts.currentPage || 1}
              onChange={(_, value) => {
                setTopSellingProducts((prev: any) => ({
                  ...prev,
                  currentPage: value,
                }));
              }}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Top Khách Hàng Mua Nhiều</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã mua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCustomers?.data?.map((customer: any, index: any) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.purchases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(customer.totalSpent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Pagination
              count={1}
              page={1}
              onChange={() => {}}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
