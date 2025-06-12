import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

export const AddProductForm = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<any | null>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    width: "",
    height: "",
    length: "",
    categoryId: "",
    stockQuantity: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        setImages((prevImages) => [...prevImages, ...files]);
      }
      document.body.removeChild(input);
    });

    input.click();
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const request: any = {
      ...formData,
      images: images,
    };

    try {
      const response: any = await backendClient.createProduct(request);
      if (!response) {
        return;
      }
      // clear form
      setFormData({
        name: "",
        description: "",
        price: "",
        weight: "",
        width: "",
        height: "",
        length: "",
        categoryId: "",
        stockQuantity: "",
      });
      setImages([]);
      dispatch(
        commonStore.actions.setSuccessMessage("Thêm sản phẩm thành công")
      );
    } catch (error) {
      dispatch(commonStore.actions.setErrorMessage("Thêm sản phẩm thất bại"));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await backendClient.getOptionsCategories();
        const result = response.data;
        if (!result) {
          return;
        }
        setCategories(result.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Thêm sản phẩm mới
      </h1>

      <div className="space-y-3">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Kích thước sản phẩm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cân nặng (g)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiều rộng (cm)
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chiều dài (cm)
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục sản phẩm *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh sản phẩm *
          </label>
          <div>
            <input
              type="file"
              name="images"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setImages((prevImages) => [...prevImages, ...files]);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
            />

            <button
              className="action-button flex gap-2 hover: cursor-pointer items-center bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleUploadClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p>Có thể chọn nhiều hình ảnh</p>
            </button>

            <div className="attachments mt-4">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="attachment relative inline-block mr-4"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="attachment-image w-50 h-50 object-cover rounded-md"
                  />
                  <div
                    className="remove-attachment absolute top-0 right-0 bg-white p-1 rounded-full cursor-pointer"
                    onClick={() => removeImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                name: "",
                description: "",
                price: "",
                weight: "",
                width: "",
                height: "",
                length: "",
                categoryId: "",
                stockQuantity: "",
              })
            }
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Form
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lưu sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
