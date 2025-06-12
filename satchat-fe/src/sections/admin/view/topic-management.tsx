import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Grid,
  List,
  MoreHorizontal,
} from "lucide-react";
import { Pagination } from "@mui/material";
import backendClient from "@/utils/BackendClient";
import { useDispatch } from "react-redux";
import { commonStore } from "@/store/reducers";

export const TopicManagement = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [initialData, setInitialData] = useState<any | null>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<any | null>(null);
  const [newTopic, setNewTopic] = useState({
    name: "",
    color: "#000000",
  });

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

  const handleOpenModal = (topic: any | null = null) => {
    if (topic) {
      setCurrentTopic(topic);
      setNewTopic({
        name: topic?.name,
        color: topic?.color,
      });
    } else {
      setCurrentTopic(null);
      setNewTopic({
        name: "",
        color: "#000000",
      });
    }
    setShowModal(true);
  };

  const handleSaveTopic = async () => {
    if (currentTopic) {
      try {
        const response: any = await backendClient.updateTopic(
          currentTopic.id,
          newTopic
        );
        if (response) {
          // update UI
          const updatedTopics = initialData?.data?.map((topic: any) =>
            topic.id === currentTopic.id ? { ...topic, ...newTopic } : topic
          );
          setInitialData((prev: any) => ({
            ...prev,
            data: updatedTopics,
          }));

          dispatch(
            commonStore.actions.setSuccessMessage("Cập nhật chủ đề thành công")
          );
        }
      } catch (error) {
        dispatch(
          commonStore.actions.setErrorMessage("Không thể cập nhật chủ đề")
        );
      }
    } else {
      const request = {
        name: newTopic.name,
        color: newTopic.color,
      };

      try {
        const response: any = await backendClient.createTopic(request);
        let result = response.data;
        if (response) {
          // update UI
          setInitialData((prev: any) => ({
            ...prev,
            data: [result?.data, ...prev.data],
          }));
          dispatch(
            commonStore.actions.setSuccessMessage("Tạo chủ đề thành công")
          );
        }
      } catch (error) {
        dispatch(commonStore.actions.setErrorMessage("Tạo không thành công"));
      }
    }
    setShowModal(false);
  };

  const handleDeleteTopic = async (id: any) => {
    try {
      const response: any = await backendClient.deleteTopic(id);
      if (response) {
        const updatedTopics = initialData?.data?.filter(
          (topic: any) => topic.id !== id
        );
        setInitialData({ ...initialData, data: updatedTopics });
        dispatch(
          commonStore.actions.setSuccessMessage("Xóa chủ đề thành công")
        );
      }
    } catch (error) {
      dispatch(commonStore.actions.setErrorMessage("Xóa không thành công"));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await backendClient.getAllTopics(page, searchTerm);
      const initialData = response.data;
      if (initialData) {
        setInitialData(initialData);
        if (initialData?.currentPage) setPage(initialData.currentPage);
      } else {
        dispatch(
          commonStore.actions.setErrorMessage("Không thể tải dữ liệu chủ đề")
        );
      }
    };

    fetchData();
  }, [page, searchTerm]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold">Quản lý chủ đề</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 bg-gray-200 rounded-md p-1">
              <button
                className={`p-1 rounded ${
                  viewMode === "grid" ? "bg-white shadow" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className={`p-1 rounded ${
                  viewMode === "list" ? "bg-white shadow" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => handleOpenModal()}
            >
              <Plus className="h-5 w-5" />
              <span>Thêm chủ đề</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {initialData?.data?.map((topic: any) => (
              <div
                key={topic.id}
                className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: topic.color }}
                ></div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {topic.name}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{topic.postCount} bài viết</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="dropdown inline-block relative">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </button>
                        <div className="dropdown-menu absolute right-0 hidden bg-white mt-1 rounded-md shadow-lg border border-gray-200 z-10">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleOpenModal(topic)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleDeleteTopic(topic.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <div>Tạo: {formatDate(topic.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4 mb-4">
            <Pagination
              count={initialData.totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chủ đề
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số bài viết
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
                  Cập nhật lần cuối
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialData?.data?.map((topic: any) => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-full mr-3"
                        style={{ backgroundColor: topic.color }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">
                        {topic.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {topic.postCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(topic.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(topic.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(topic)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4 mb-4">
            <Pagination
              count={initialData.totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      )}

      {/* Modal for Add/Edit Topic */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentTopic ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="topic-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Tên chủ đề
                        </label>
                        <input
                          type="text"
                          id="topic-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTopic.name}
                          onChange={(e) =>
                            setNewTopic({ ...newTopic, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="topic-color"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Màu sắc
                        </label>
                        <div className="mt-1 flex items-center">
                          <div
                            className="h-8 w-8 rounded-full mr-3"
                            style={{ backgroundColor: newTopic.color }}
                          ></div>
                          <input
                            type="color"
                            id="topic-color"
                            className="h-8 w-16 border border-gray-300 rounded"
                            value={newTopic.color}
                            onChange={(e) =>
                              setNewTopic({
                                ...newTopic,
                                color: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveTopic}
                >
                  {currentTopic ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
