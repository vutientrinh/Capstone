"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  ChevronDown,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { productStore } from "@/store/reducers";
import { useTranslation } from "react-i18next";

export const FilterBar = ({
  onFilterChange,
  onSortChange,
  initialFilters = {},
}: {
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: any) => void;
  initialFilters?: any;
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: null,
    inStock: false,
    ...initialFilters,
  });

  // Sorting state
  const [sort, setSort] = useState({
    field: "createdAt",
    direction: "desc",
  });

  // State for mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Categories from sample data
  const categories = [
    "Electronics",
    "Fashion",
    "Health & Beauty",
    "Home & Kitchen",
    "SmartPhone",
  ];

  // Apply filters
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    dispatch(productStore.actions.setFilter({ filters, sort }));
  }, [filters, onFilterChange]);

  // Apply sorting
  useEffect(() => {
    if (onSortChange) {
      onSortChange(sort);
    }
    dispatch(productStore.actions.setFilter({ filters, sort }));
  }, [sort, onSortChange]);

  // Handle filter changes
  const handleFilterChange = (field: any, value: any) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handle sort changes
  const handleSortChange = (field: any) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: null,
      inStock: false,
    });
    setSort({
      field: "createdAt",
      direction: "desc",
    });
  };

  // Star rating component
  const StarRating = ({
    rating,
    onSelect,
  }: {
    rating: number;
    onSelect: (rating: number | null) => void;
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`cursor-pointer ${
              rating >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onSelect(star === rating ? null : star)}
          />
        ))}
      </div>
    );
  };

  // Format price with VND
  const formatPrice = (price: any) => {
    if (!price) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-[var(--background)] p-4 mb-6">
      {/* Search and filter toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={t("marketplace.search")}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center md:hidden gap-2 ml-2 px-3 py-2 bg-[var(--foreground)] rounded-lg"
        >
          <SlidersHorizontal size={16} color="var(--background)" />
          <span style={{ color: "var(--background)" }}>Filters</span>
        </button>
      </div>

      {/* Filters section */}
      <div className={`${showFilters ? "block" : "hidden"} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              {t("marketplace.category")}
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">{t("marketplace.allCategories")}</option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    style={{ color: "text-gray-800" }}
                  >
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-gray-400"
              />
            </div>
          </div>

          {/* Price range */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              {t("marketplace.priceRange")} (VND)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={t("marketplace.min")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder={t("marketplace.max")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Rating filter - moved to new row */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              {t("marketplace.rating")}
            </label>
            <StarRating
              rating={filters.rating}
              onSelect={(rating) => handleFilterChange("rating", rating)}
            />
          </div>

          {/* Stock filter - moved to new row */}
          <div className="md:col-span-1 flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                checked={filters.inStock}
                onChange={(e) =>
                  handleFilterChange("inStock", e.target.checked)
                }
              />
              <span className="text-sm">{t("marketplace.inStockOnly")}</span>
            </label>
          </div>

          {/* Reset filters - moved to new row */}
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <X size={14} color="var(--foreground)" />
              <span style={{ color: "var(--foreground)" }}>
                {t("marketplace.resetFilters")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sort options */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
        <span className="text-sm font-medium text-[var(--foreground)]">
          Sort by:
        </span>

        <button
          className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
            sort.field === "createdAt"
              ? "bg-blue-100 text-blue-800"
              : "bg-[var(--foreground)] text-[var(--background)]"
          }`}
          onClick={() => handleSortChange("createdAt")}
        >
          {t("marketplace.Latest")}
          {sort.field === "createdAt" && (
            <ArrowUpDown
              size={14}
              className={sort.direction === "asc" ? "rotate-180" : ""}
            />
          )}
        </button>

        <button
          className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
            sort.field === "price"
              ? "bg-blue-100 text-blue-800"
              : "bg-[var(--foreground)] text-[var(--background)]"
          }`}
          onClick={() => handleSortChange("price")}
        >
          {t("marketplace.Price")}
          {sort.field === "price" && (
            <ArrowUpDown
              size={14}
              className={sort.direction === "asc" ? "rotate-180" : ""}
            />
          )}
        </button>

        <button
          className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
            sort.field === "name"
              ? "bg-blue-100 text-blue-800"
              : "bg-[var(--foreground)] text-[var(--background)]"
          }`}
          onClick={() => handleSortChange("name")}
        >
          {t("marketplace.Name")}
          {sort.field === "name" && (
            <ArrowUpDown
              size={14}
              className={sort.direction === "asc" ? "rotate-180" : ""}
            />
          )}
        </button>

        <button
          className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
            sort.field === "rating"
              ? "bg-blue-100 text-blue-800"
              : "bg-[var(--foreground)] text-[var(--background)]"
          }`}
          onClick={() => handleSortChange("rating")}
        >
          {t("marketplace.Rating")}
          {sort.field === "rating" && (
            <ArrowUpDown
              size={14}
              className={sort.direction === "asc" ? "rotate-180" : ""}
            />
          )}
        </button>
      </div>

      {/* Active filters display */}
      {(filters.search ||
        filters.category ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.rating ||
        filters.inStock) && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm text-[var(--foreground)]">
            Active filters:
          </span>

          {filters.search && (
            <span className="px-2 py-1 bg-[var(--foreground)] rounded-full text-xs flex items-center gap-1">
              <p style={{ color: "var(--background)" }}>
                {t("marketplace.search")}: {filters.search}
              </p>
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => handleFilterChange("search", "")}
              />
            </span>
          )}

          {filters.category && (
            <span className="px-2 py-1 bg-[var(--foreground)] rounded-full text-xs flex items-center gap-1">
              <p style={{ color: "var(--background)" }}>
                {t("marketplace.category")}: {filters.category}
              </p>
              <X
                size={12}
                className="cursor-pointer"
                color="var(--background)"
                onClick={() => handleFilterChange("category", "")}
              />
            </span>
          )}

          {(filters.minPrice || filters.maxPrice) && (
            <span className="px-2 py-1 bg-[var(--foreground)] rounded-full text-xs flex items-center gap-1">
              <p style={{ color: "var(--background)" }}>
                {t("marketplace.Price")}:{" "}
                {filters.minPrice ? formatPrice(filters.minPrice) : "0"} -{" "}
                {filters.maxPrice ? formatPrice(filters.maxPrice) : "∞"}
              </p>
              <X
                size={12}
                className="cursor-pointer"
                color="var(--background)"
                onClick={() => {
                  handleFilterChange("minPrice", "");
                  handleFilterChange("maxPrice", "");
                }}
              />
            </span>
          )}

          {filters.rating && (
            <span className="px-2 py-1 bg-[var(--foreground)] rounded-full text-xs flex items-center gap-1">
              <p style={{ color: "var(--background)" }}>
                {t("marketplace.Rating")}: {filters.rating}+ stars
              </p>
              <X
                size={12}
                color="var(--background)"
                className="cursor-pointer"
                onClick={() => handleFilterChange("rating", null)}
              />
            </span>
          )}

          {filters.inStock && (
            <span className="px-2 py-1 bg-[var(--foreground)] rounded-full text-xs flex items-center gap-1">
              <p style={{ color: "var(--background)" }}>
                {t("marketplace.inStockOnly")}
              </p>
              <X
                size={12}
                color="var(--background)"
                className="cursor-pointer"
                onClick={() => handleFilterChange("inStock", false)}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
