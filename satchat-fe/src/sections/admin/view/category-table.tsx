import { Pagination } from "@mui/material";
import { use, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import backendClient from "@/utils/BackendClient";
import { tryLoadManifestWithRetries } from "next/dist/server/load-components";
import { useDispatch } from "react-redux";
import { commonStore } from "@/store/reducers";

export const CategoryTable = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [categories, setCategories] = useState<any | null>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modelCategory, setModelCategory] = useState<any | null>(false);
  const [categoryId, setCategoryId] = useState<any | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = async (id: any) => {
    const request: any = {
      name: name,
      description: description,
    };

    try {
      const response: any = await backendClient.updateCategogy(id, request);
      if (!response) {
        return;
      }
      fetchCategories();
      setModelCategory(false);

      // reset form fields
      setName("");
      setDescription("");
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Sửa danh mục sản phẩm thành công"
        )
      );
    } catch (error) {
      dispatch(
        commonStore.actions.setErrorMessage("Sửa danh mục sản phẩm thất bại")
      );
    }
  };

  const handleRemove = async (id: any) => {
    try {
      const response: any = await backendClient.deleteCategogy(id);
      if (!response) {
        return;
      }
      fetchCategories();
      setModelCategory(false);

      // reset state
      const updatedData = categories?.data.filter(
        (category: any) => category.id !== id
      );
      setCategories({
        ...categories,
        data: updatedData,
        totalElements: (categories?.totalElements || 1) - 1,
      });

      dispatch(
        commonStore.actions.setSuccessMessage(
          "Xóa danh mục sản phẩm thành công"
        )
      );
    } catch (error) {
      dispatch(
        commonStore.actions.setErrorMessage("Xóa danh mục sản phẩm thất bại")
      );
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchCategories = async () => {
    const response: any = await backendClient.getAllCategories(page);
    if (!response) {
      return;
    }
    setCategories(response.data);
  };

  const handleCreateCategory = async (name: any, description: any) => {
    const request: any = {
      name: name,
      description: description,
    };

    try {
      const response: any = await backendClient.createCategogy(request);
      if (!response) {
        return;
      }
      fetchCategories();
      setModelCategory(false);

      // reset form fields
      setName("");
      setDescription("");
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Thêm danh mục sản phẩm thành công"
        )
      );
    } catch (error) {
      dispatch(
        commonStore.actions.setErrorMessage("Thêm danh mục sản phẩm thất bại")
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách danh mục</h1>
        <button
          onClick={() => {
            setModelCategory(true);
            setIsEdit(false);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Thêm danh mục mới
        </button>
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
                  Tên danh mục
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mô tả
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
                  Cập nhật cuối
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
              {categories?.data?.map((category: any) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <strong>{category.name}</strong>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="line-clamp-2 max-w-md">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(category.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setIsEdit(true);
                          setModelCategory(true);
                          setName(category.name);
                          setDescription(category.description);
                          setCategoryId(category.id);
                        }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleRemove(category.id)}
                      >
                        <DeleteIcon />
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
          count={categories?.totalPages || 1}
          page={categories?.currentPage || 1}
          onChange={(_, value) => setPage(value)}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          shape="rounded"
        />
      </div>

      {modelCategory && (
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      {isEdit ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </h2>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên danh mục
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mô tả
                        </label>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full"
                          required
                        ></textarea>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setModelCategory(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          onClick={() => {
                            if (!isEdit) {
                              handleCreateCategory(name, description);
                            } else {
                              handleEdit(categoryId);
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {isEdit ? "Cập nhật" : "Thêm danh mục"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
