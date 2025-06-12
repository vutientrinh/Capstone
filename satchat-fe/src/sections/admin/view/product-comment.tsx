import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const ProductComment = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<any | null>("");
  const [commentsData, setCommentsData] = useState<any | null>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const response: any = await backendClient.getAllProductComments(
        page,
        searchValue
      );
      if (!response) {
        return;
      }
      setCommentsData(response.data);
    };

    fetchProducts();
  }, [page, searchValue]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const StarRating = ({ rating }: { rating: any }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const handleDelete = async (id: any) => {
    try {
      const response: any = await backendClient.deleteProductComment(id);
      if (!response) {
        return;
      }
      // update the state commentData
      setCommentsData((prevData: any) => {
        return {
          ...prevData,
          data: prevData.data.filter((item: any) => item.id !== id),
        };
      });
      dispatch(commonStore.actions.setSuccessMessage("Xóa comment thành công"));
    } catch (error) {
      console.error("Error deleting comment:", error);
      dispatch(
        commonStore.actions.setErrorMessage("Xóa comment không thành công")
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Comment Sản Phẩm</h1>
        <div className="flex">
          <div className="relative mr-4">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm..."
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      {/* Comments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commentsData?.data?.map((comment: any) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {comment.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {comment.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {comment.comment}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <StarRating rating={comment.rating} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex justify-center sm:justify-end mt-4 overflow-x-auto">
        <Pagination
          count={commentsData?.totalPages || 1}
          page={commentsData?.currentPage || 1}
          onChange={(_, value) => setPage(value)}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};
