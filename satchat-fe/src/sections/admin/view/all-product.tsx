import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Pagination } from "@mui/material";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IMGAES_URL } from "@/global-config";
import backendClient from "@/utils/BackendClient";
import { UpdateProductDialog } from "@/components/dialog-update-product";
import { useDispatch } from "react-redux";
import { commonStore } from "@/store/reducers";

export const AllProduct = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [productsResponse, setProductsResponse] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [product, setProduct] = useState<any | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response: any = await backendClient.getAllProductsAdmin(
        page,
        searchValue
      );
      if (!response) {
        return;
      }
      setProductsResponse(response.data);
    };

    fetchProducts();
  }, [page, searchValue]);

  const handleChangeValue = (value: string) => {
    setSearchValue(value);
  };

  const handleHiddenProduct = async (product: any) => {
    if (!product) return;
    try {
      const response = await backendClient.setVisible(
        product.id,
        !product.visible
      );
      if (response) {
        setProductsResponse((prev: any) => {
          return {
            ...prev,
            data: prev.data.map((item: any) =>
              item.id === product.id
                ? { ...item, visible: !item.visible }
                : item
            ),
          };
        });
        dispatch(
          commonStore.actions.setSuccessMessage("Ẩn sản phẩm thành công")
        );
      }
    } catch (error) {
      console.log("error: ", error);
      dispatch(commonStore.actions.setErrorMessage("Ẩn sản phẩm thất bại"));
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-100  max-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Tất cả sản phẩm
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchValue}
              onChange={(e) => handleChangeValue(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chỉnh sửa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ẩn/Hiện
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(productsResponse?.data) &&
                productsResponse.data.length > 0 ? (
                  productsResponse.data.map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={
                              product.images?.[0]
                                ? IMGAES_URL + product.images[0]
                                : "/img/avatar_default.jpg"
                            }
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.price.toLocaleString()} đ
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stockQuantity}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {product.rating.toFixed(1)}
                          </span>
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className="h-4 w-4"
                                fill={
                                  star <= Math.round(product.rating)
                                    ? "currentColor"
                                    : "none"
                                }
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                ></path>
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-400">
                            ({product.amountRating})
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <button
                          onClick={() => {
                            setProduct(product);
                            setModalVisible(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EditIcon />
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <button
                          onClick={() => {
                            handleHiddenProduct(product);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {product.visible ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="w-full flex justify-center sm:justify-end mt-4 overflow-x-auto">
              <Pagination
                count={productsResponse?.totalPages || 1}
                page={productsResponse?.currentPage || 1}
                onChange={(_, value) => setPage(value)}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <UpdateProductDialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        initialData={product}
      />
    </>
  );
};
