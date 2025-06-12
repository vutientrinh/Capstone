"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { Helmet } from "react-helmet-async";
// Import icons from React Icons
import {
  FaChartLine,
  FaBox,
  FaPercent,
  FaShoppingCart,
  FaComments,
  FaUsers,
  FaList,
  FaWarehouse,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
} from "react-icons/fa";
import {
  AddProductForm,
  AllProduct,
  CategoryTable,
  CommentTable,
  Dashboard,
  LLMManagement,
  PostTables,
  ProductComment,
  TopicManagement,
  UserManagement,
} from "@/sections/admin";
import OrderManagement from "@/sections/admin/view/order-management";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<{
    parent: string;
    child?: string;
  } | null>(null);

  // State for sidebar collapse
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  console.log(activeTab);
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const checkWindowSize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width <= 768) {
        setCollapsed(true);
      }
    };
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSubmenu = (index: number) => {
    setActiveMenuItem(activeMenuItem === index ? null : index);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const getPageTitle = (path: string) => {
    return path.split("/").pop() || "Dashboard";
  };

  const menuItems: any[] = [
    { icon: FaChartLine, text: "Dashboard", hasSubmenu: false },
    {
      icon: FaBox,
      text: "Sản phẩm",
      hasSubmenu: true,
      submenu: ["Tất cả sản phẩm", "Thêm sản phẩm mới", "Danh mục sản phẩm"],
    },
    {
      icon: FaShoppingCart,
      text: "Đơn đặt hàng",
      hasSubmenu: false,
    },
    {
      icon: FaComments,
      text: "Bình luận",
      hasSubmenu: true,
      submenu: ["Bình luận bài viết", "Đánh giá sản phẩm", "Đánh giá bài viết"],
    },
    {
      icon: FaUsers,
      text: "Users",
      hasSubmenu: true,
      submenu: ["Tất cả người dùng"],
    },
    {
      icon: FaList,
      text: "Danh mục chủ đề",
      hasSubmenu: true,
      submenu: ["Quản lý chủ đề"],
    },
    {
      icon: FaWarehouse,
      text: "LLMs",
      hasSubmenu: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{getPageTitle(pathname)} | satchat</title>
      </Helmet>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          mobileOpen ? "block" : "hidden"
        }`}
        onClick={closeMobileSidebar}
      />
      <button
        className="fixed top-2 left-2 z-50 bg-gray-900 text-white border-none text-2xl py-1 px-3 cursor-pointer md:hidden"
        onClick={toggleMobileSidebar}
      >
        <FaBars />
      </button>
      <div
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-50 overflow-y-auto
          ${collapsed ? "w-16" : "w-64"} 
          ${
            mobileOpen
              ? "translate-x-0"
              : "sm:translate-x-0 max-sm:-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div
            className={`text-xl font-bold whitespace-nowrap ${
              collapsed ? "hidden" : "block"
            }`}
          >
            <FaUserShield className="inline mr-2" />
            Admin Panel
          </div>
          <button
            className={`text-white bg-transparent border-none text-xl cursor-pointer p-1 z-50 ${
              collapsed ? "mx-auto" : ""
            }`}
            onClick={toggleSidebar}
          >
            {collapsed ? <FaBars /> : <FaChevronLeft />}
          </button>
        </div>
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              className={`py-4 px-4 flex items-center cursor-pointer transition-colors hover:bg-gray-700
                  ${activeMenuItem === index ? "bg-gray-700" : ""}`}
              onClick={() => {
                toggleSubmenu(index);
                if (item.hasSubmenu) {
                  setActiveTab({ parent: item.text, child: item.submenu?.[0] });
                } else {
                  setActiveTab({ parent: item.text });
                }
                setActiveMenuItem(index);
              }}
            >
              <item.icon className="mr-4 text-lg min-w-6 text-center" />
              <span
                className={`whitespace-nowrap transition-opacity ${
                  collapsed ? "opacity-0 hidden" : "opacity-100"
                }`}
              >
                {item.text}
              </span>
              {item.hasSubmenu && (
                <FaChevronRight
                  className={`ml-auto transition-transform
                      ${activeMenuItem === index ? "rotate-90" : ""}
                      ${collapsed ? "hidden" : "block"}`}
                />
              )}
            </div>
            {item.hasSubmenu && (
              <div
                className={`max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-gray-800
                  ${activeMenuItem === index ? "max-h-96" : "max-h-0"}`}
              >
                {item.submenu &&
                  item.submenu.map((subItem: any, subIndex: any) => (
                    <a
                      key={subIndex}
                      href="#"
                      onClick={() =>
                        setActiveTab({ parent: item.text, child: subItem })
                      }
                      className={`py-3 px-4 pl-12 block text-gray-300 hover:bg-gray-700 transition-colors
                ${
                  activeTab?.parent === item.text &&
                  activeTab?.child === subItem
                    ? "bg-gray-700 font-semibold"
                    : ""
                }`}
                    >
                      {subItem}
                    </a>
                  ))}
              </div>
            )}
          </div>
        ))}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-700">
          <a
            href="#"
            className={`py-4 px-4 flex items-center cursor-pointer transition-colors hover:bg-gray-700`}
          >
            <FaSignOutAlt className="mr-4 text-lg min-w-6 text-center" />
            <span
              className={`whitespace-nowrap transition-opacity ${
                collapsed ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              Đăng xuất
            </span>
          </a>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out p-5
          ${collapsed ? "ml-16" : "ml-64"} 
          ${windowWidth <= 576 ? "ml-0" : ""}`}
      >
        {(!activeTab ||
          (activeTab.parent === "Dashboard" && !activeTab.child)) && (
          <Dashboard />
        )}
        {activeTab &&
          activeTab.parent === "Sản phẩm" &&
          activeTab.child === "Tất cả sản phẩm" && <AllProduct />}
        {activeTab &&
          activeTab.parent === "Sản phẩm" &&
          activeTab.child === "Thêm sản phẩm mới" && <AddProductForm />}
        {activeTab &&
          activeTab.parent === "Sản phẩm" &&
          activeTab.child === "Danh mục sản phẩm" && <CategoryTable />}
        {activeTab && activeTab.parent === "Đơn đặt hàng" && (
          <OrderManagement />
        )}
        {activeTab &&
          activeTab.parent === "Bình luận" &&
          activeTab.child === "Đánh giá sản phẩm" && <ProductComment />}
        {activeTab &&
          activeTab.parent === "Bình luận" &&
          activeTab.child === "Bình luận bài viết" && <CommentTable />}
        {activeTab &&
          activeTab.parent === "Bình luận" &&
          activeTab.child === "Đánh giá bài viết" && <PostTables />}
        {activeTab &&
          activeTab.parent === "Users" &&
          activeTab.child === "Tất cả người dùng" && <UserManagement />}
        {activeTab &&
          activeTab.parent === "Danh mục chủ đề" &&
          activeTab.child === "Quản lý chủ đề" && <TopicManagement />}
        {activeTab && activeTab.parent === "LLMs" && <LLMManagement />}
      </div>
    </>
  );
};

export default AdminDashboard;
