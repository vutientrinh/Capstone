import { addressStore, commonStore, profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Dialog, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const AddressDialog = ({
  isDialogOpen,
  name = "",
  phone = "",
  address = "",
}: {
  isDialogOpen: boolean;
  name?: string;
  phone?: string;
  address?: string;
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("province");
  const currentUser = useSelector(profileStore.selectCurrentUser);

  // Location data
  const [ten, setTen] = useState(name);
  const [sdt, setSdt] = useState(phone);
  const [diaChi, setDiaChi] = useState(address);
  const [provinces, setProvinces] = useState([] as any[]);
  const [districts, setDistricts] = useState([] as any[]);
  const [wards, setWards] = useState([] as any[]);
  const [selectedProvince, setSelectedProvince] = useState({} as any);
  const [selectedDistrict, setSelectedDistrict] = useState({} as any);
  const [selectedWard, setSelectedWard] = useState({} as any);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response: any = await backendClient.getProvinces();
      const { data } = response.data;
      setProvinces(data);
    };

    const fetchDistricts = async () => {
      if (!selectedProvince.ProvinceID) return;
      const response: any = await backendClient.getDistricts(
        selectedProvince.ProvinceID
      );
      const { data } = response.data;
      setDistricts(data);
    };

    const fetchWards = async () => {
      if (!selectedDistrict.DistrictID) return;
      const response: any = await backendClient.getWards(
        selectedDistrict.DistrictID
      );
      const { data } = response.data;
      setWards(data);
    };

    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, [selectedProvince, selectedDistrict, dispatch]);

  const handleSaveAddress = async () => {
    const payload = {
      userId: currentUser?.id,
      address: diaChi,
      phone: sdt,
      provinceName: selectedProvince.ProvinceName,
      provinceId: selectedProvince.ProvinceID,
      districtName: selectedDistrict.DistrictName,
      districtId: selectedDistrict.DistrictID,
      wardName: selectedWard.WardName,
      wardCode: selectedWard.WardCode,
    };
    // fetching API
    try {
      const response: any = await backendClient.createAddress(payload);
      const { data } = response.data;
      dispatch(addressStore.actions.addAddress(data));
      dispatch(addressStore.actions.setIsOpen(false));
    } catch (e) {
      console.error("Error creating address:", e);
      dispatch(commonStore.actions.setErrorMessage("Error creating address"));
    }
  };

  // Handles province selection
  const handleSelectProvince = (province: any) => {
    setSelectedProvince(province);
    setActiveTab("district");
  };

  // Handles district selection
  const handleSelectDistrict = (district: any) => {
    setSelectedDistrict(district);
    setActiveTab("ward");
  };

  // Handles ward selection
  const handleSelectWard = (ward: any) => {
    setSelectedWard(ward);
    // Close the location selector after selecting ward
    setActiveTab("");
  };

  const renderLocationSelector = () => {
    switch (activeTab) {
      case "province":
        return (
          <div className="max-h-40 overflow-y-auto">
            {provinces.map((province) => (
              <div
                key={province.ProvinceID}
                className={`p-2 border-b border-gray-200 cursor-pointer ${
                  selectedProvince?.ProvinceID === province.ProvinceID
                    ? "text-red-500 font-bold"
                    : ""
                }`}
                onClick={() => handleSelectProvince(province)}
              >
                {province.ProvinceName}
              </div>
            ))}
          </div>
        );
      case "district":
        return (
          <div className="max-h-40 overflow-y-auto">
            {districts.map((district) => (
              <div
                key={district.DistrictID}
                className={`p-2 border-b border-gray-200 cursor-pointer ${
                  selectedDistrict?.DistrictID === district.DistrictID
                    ? "text-red-500 font-bold"
                    : ""
                }`}
                onClick={() => handleSelectDistrict(district)}
              >
                {district.DistrictName}
              </div>
            ))}
          </div>
        );
      case "ward":
        return (
          <div className="max-h-40 overflow-y-auto">
            {wards.map((ward) => (
              <div
                key={ward.WardCode}
                className={`p-2 border-b border-gray-200 cursor-pointer ${
                  selectedWard?.WardCode === ward.WardCode
                    ? "text-red-500 font-bold"
                    : ""
                }`}
                onClick={() => handleSelectWard(ward)}
              >
                {ward.WardName}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Main content rendering
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => dispatch(addressStore.actions.setIsOpen(false))}
    >
      <DialogContent>
        <div>
          <h2 className="text-xl font-semibold mb-4">Cập nhật địa chỉ</h2>

          {/* Name and Phone */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={ten}
                placeholder="Họ và tên"
                onChange={(e) => {
                  setTen(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={sdt}
                placeholder="Số điện thoại"
                onChange={(e) => {
                  setSdt(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Location Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
            </label>
            <div
              className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
              onClick={() => setActiveTab("province")}
            >
              {`${selectedProvince?.ProvinceName || "Tỉnh"}, ${
                selectedDistrict?.DistrictName || "Huyện"
              }, ${selectedWard?.WardName || "Phường/Xã"}`}
            </div>

            {/* Location Tabs */}
            {activeTab && (
              <div className="border border-gray-300 rounded-md mt-1">
                <div className="flex border-b">
                  <div
                    className={`flex-1 text-center py-2 cursor-pointer ${
                      activeTab === "province"
                        ? "text-red-500 border-b-2 border-red-500"
                        : ""
                    }`}
                    onClick={() => setActiveTab("province")}
                  >
                    Tỉnh/Thành phố
                  </div>
                  <div
                    className={`flex-1 text-center py-2 cursor-pointer ${
                      activeTab === "district"
                        ? "text-red-500 border-b-2 border-red-500"
                        : ""
                    }`}
                    onClick={() => setActiveTab("district")}
                  >
                    Quận/Huyện
                  </div>
                  <div
                    className={`flex-1 text-center py-2 cursor-pointer ${
                      activeTab === "ward"
                        ? "text-red-500 border-b-2 border-red-500"
                        : ""
                    }`}
                    onClick={() => setActiveTab("ward")}
                  >
                    Phường/Xã
                  </div>
                </div>
                {renderLocationSelector()}
              </div>
            )}
          </div>

          {/* Detailed Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ cụ thể
            </label>
            <input
              type="text"
              value={diaChi}
              placeholder="Địa chỉ cụ thể"
              onChange={(e) => {
                setDiaChi(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:cursor-pointer"
              onClick={() => {
                dispatch(addressStore.actions.setIsOpen(false));
              }}
            >
              Trở Lại
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:cursor-pointer"
              onClick={handleSaveAddress}
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
