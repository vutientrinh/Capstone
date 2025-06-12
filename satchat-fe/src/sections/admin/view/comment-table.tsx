import { IMGAES_URL } from "@/global-config";
import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import DeleteIcon from "@mui/icons-material/Delete";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const CommentTable = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [commentsData, setCommentsData] = useState<any | null>({});

  // Function to handle status change
  const handleStatusChange = async (id: any, newStatus: any) => {
    try {
      const response: any = await backendClient.setStatusComment(id, newStatus);
      if (!response) {
        return;
      }

      dispatch(
        commonStore.actions.setSuccessMessage("Cập nhật trạng thái thành công!")
      );
      // update status
      const updatedData = commentsData.data.map((comment: any) => {
        if (comment.id === id) {
          return { ...comment, status: newStatus };
        }
        return comment;
      });

      setCommentsData({
        ...commentsData,
        data: updatedData,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(
        commonStore.actions.setErrorMessage("Cập nhật trạng thái thất bại!")
      );
    }
  };

  // Generate shortened post ID for display
  const shortenId = (id: any) => {
    return id.substring(0, 8) + "...";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response: any = await backendClient.getAllPostComments(page);
      if (!response) {
        return;
      }
      setCommentsData(response.data);
    };

    fetchProducts();
  }, [page]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bình luận</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">
            Tổng số: {commentsData.totalElements} bình luận
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nội dung bình luận
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bài viết
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lượt thích
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commentsData?.data?.map((comment: any) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={IMGAES_URL + comment.author.avatar}
                          alt={`${comment.author.firstName} ${comment.author.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {comment.author.firstName} {comment.author.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{comment.author.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs break-words">
                      {comment.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">
                      {shortenId(comment.postId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {comment.likedCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold
      ${comment.status === "APPROVED" ? "bg-green-100 text-green-800" : ""}
      ${comment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
      ${comment.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
      ${comment.status === "DELETED" ? "bg-gray-100 text-gray-800" : ""}
    `}
                    >
                      <select
                        value={comment.status}
                        onChange={(e) =>
                          handleStatusChange(comment.id, e.target.value)
                        }
                        className="bg-transparent outline-none"
                      >
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="REJECTED">Từ chối</option>
                        <option value="DELETED">Đã xóa</option>
                      </select>
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
          count={commentsData.totalPages || 1}
          page={commentsData.currentPage || 1}
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

export default CommentTable;
