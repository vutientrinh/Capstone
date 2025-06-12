import React, { useState } from "react";
import { Heart, ShoppingCart, Star, Check, Info } from "lucide-react";
import { IMGAES_URL } from "@/global-config";
import { useDispatch, useSelector } from "react-redux";
import {
  cartStore,
  commonStore,
  likedProductStore,
  productStore,
  profileStore,
} from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { useTranslation } from "react-i18next";

export const ProductCard = ({ product }: { product: any }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showQuickView, setShowQuickView] = useState(false);
  const currentUser = useSelector(profileStore.selectCurrentUser);

  // Format price based on locale
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "USD",
      minimumFractionDigits: product.currency === "VND" ? 0 : 2,
    }).format(price);
  };

  const handleQuantityChange = async (
    productId: string,
    price: number,
    quantity: number
  ) => {
    try {
      const payload = {
        userId: currentUser?.id,
        productId,
        price,
        quantity,
      };
      const response: any = await backendClient.addToCart(payload);
      if (!response?.data) {
        return;
      }
      const result = response?.data.data;
      dispatch(cartStore.actions.setCart(result));
      dispatch(
        commonStore.actions.setSuccessMessage(
          "Product added to cart successfully!"
        )
      );
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  // Quick view toggle
  const toggleQuickView = (e: any) => {
    e.preventDefault();
    setShowQuickView(!showQuickView);
  };

  // Toggle favorite status
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      productId: product.id,
    };

    try {
      let response;

      if (!product.isLiked) {
        response = await backendClient.likeProduct(payload);
        if (response?.data) {
          dispatch(productStore.actions.setLikedProduct(payload));
        }
      } else {
        response = await backendClient.unlikeProduct(payload);
        if (response?.data) {
          dispatch(productStore.actions.setUnlikedProduct(payload));
          dispatch(likedProductStore.actions.setUnlikedProduct(payload));
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="w-64 bg-[var(--background-component)] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image with Quick Actions */}
      <div className="relative">
        <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={IMGAES_URL + product?.images[0]}
            alt={product?.name}
            className="object-contain h-44 w-full transition-transform duration-300 hover:scale-105"
          />

          {/* Discount Tag */}
          {/* {product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round(
                (1 - product.price / product.originalPrice) * 100
              )}
              % OFF
            </div>
          )} */}

          {/* Quick Action Buttons */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition hover:cursor-pointer"
              onClick={toggleFavorite}
            >
              <Heart
                size={18}
                className={
                  product.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600"
                }
              />
            </button>
            <button
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition hover:cursor-pointer"
              onClick={() => {
                dispatch(productStore.actions.setShowQuickView(true)); // show quick view
                dispatch(productStore.actions.setProductDetail(product)); // set product detail
              }}
            >
              <Info size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[var(--foreground)]">
            {product?.category.name}
          </span>

          {/* Stock Indicator */}
          {product?.stockQuantity > 0 ? (
            <span className="flex items-center text-xs text-green-600">
              <Check size={12} className="mr-1" />
              {t("marketplace.inStock")}
            </span>
          ) : (
            <span className="text-xs text-red-500">
              {t("marketplace.outOfStock")}
            </span>
          )}
        </div>

        <h3 className="font-medium text-[var(--foreground)] mb-1 truncate">
          <strong>{product?.name}</strong>
        </h3>

        {/* Price */}
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-red-600 mr-2">
            {formatPrice(product?.price)}
          </span>
          {/* {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )} */}
        </div>

        {/* Rating and Sales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={
                    i < Math.floor(product?.rating) ? "currentColor" : "none"
                  }
                  stroke="currentColor"
                  className={
                    i < Math.floor(product?.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
          <span className="text-xs text-[var(--foreground)]">
            {product?.salesCount.toLocaleString()} {t("marketplace.sold")}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center hover:cursor-pointer"
          onClick={() => handleQuantityChange(product?.id, product?.price, 1)}
        >
          <ShoppingCart size={16} className="mr-2" />
          {t("marketplace.addToCart")}
        </button>
      </div>
    </div>
  );
};
