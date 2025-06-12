import { use, useEffect, useState } from "react";
import { User, Edit, MoreHorizontal, Check, X, Search } from "lucide-react";
import { Pagination } from "@mui/material";
import { useDispatch } from "react-redux";
import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { IMGAES_URL } from "@/global-config";

export const UserManagement = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [initialData, setInitialData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<any | null>(null);

  const statusOptions = ["ACTIVE", "INACTIVE", "BANNED", "DELETED"];

  const handleStatusChange = async (userId: any, newStatus: any) => {
    console.log("Updating status for user:", userId, "to", newStatus);
    try {
      const response: any = await backendClient.setStatusUser(
        userId,
        newStatus
      );
      if (response) {
        const updatedUsers = initialData?.data?.map((user: any) =>
          user.id === userId ? { ...user, status: newStatus } : user
        );

        setInitialData((prev: any) => ({
          ...prev,
          data: updatedUsers,
        }));

        setEditingUser(null);
        dispatch(
          commonStore.actions.setSuccessMessage(
            "Cập nhật trạng thái thành công"
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(commonStore.actions.setErrorMessage("Có lỗi xảy ra"));
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: any = await backendClient.getAllUsers(page, searchTerm);
        if (response) {
          const initialData = response.data;
          setInitialData(initialData);
          if (initialData?.currentPage) setPage(initialData.currentPage);
        }
      } catch (error) {
        dispatch(commonStore.actions.setErrorMessage("Có lỗi xảy ra"));
      }
    };

    fetchUsers();
  }, [page, searchTerm]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Vai trò
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hoạt động
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialData?.data?.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={IMGAES_URL + user.avatar}
                            alt={user.username}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role: any, index: any) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            role === "ROLE_ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {role === "ROLE_ADMIN" ? "Admin" : "User"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      <div>Bài viết: {user.postCount}</div>
                      <div>Bạn bè: {user.friendsCount}</div>
                      <div>Người theo dõi: {user.followerCount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={selectedStatus || user.status}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              selectedStatus || user.status
                            )
                          }
                          className="p-1 text-green-600 hover:text-green-900"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="p-1 text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : user.status === "INACTIVE"
                            ? "bg-gray-100 text-gray-800"
                            : user.status === "BLOCKED"
                            ? "bg-red-100 text-red-800"
                            : user.status === "DELETED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    {editingUser !== user.id && (
                      <button
                        onClick={() => {
                          setEditingUser(user.id);
                          setSelectedStatus(user.status);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end mt-4 mb-4">
        <Pagination
          count={initialData?.totalPages || 1}
          page={page}
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
