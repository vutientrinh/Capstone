import { httpClient } from "@/config/httpClient";
import { PRODUCT_PLACEHOLDER } from "@/constant/contants";
import { IMGAES_URL } from "@/global-config";
import {
  cartStore,
  commonStore,
  likedProductStore,
  productCommentStore,
  productStore,
  profileStore,
} from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const ProductDetail = ({ display }: { display: boolean }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const product = useSelector(productStore.selectProductDetail);
  const comments = useSelector(productCommentStore.selectProductComments);
  const loading = useSelector(productCommentStore.selectLoading);
  const pageNum = useSelector(productCommentStore.selectCurrentPage);
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    name: "",
  });

  useEffect(() => {
    if (!product?.id) return;
    setImage(product?.images[0]);
    dispatch(productCommentStore.getComments(product.id, pageNum));
  }, [dispatch, product?.id, pageNum]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubmitReview = async (e: any) => {
    e.preventDefault();

    if (!newReview.comment.trim() || !newReview.name.trim()) {
      return;
    }

    // call API
    try {
      const payload = {
        productId: product?.id,
        rating: newReview.rating,
        comment: newReview.comment,
        author: newReview.name,
      };
      const response: {
        data: {
          data: any;
        };
      } = await backendClient.createProductComment(payload);
      const { data } = response.data;

      // new state
      dispatch(
        productStore.actions.addProductComment({
          productId: product?.id,
          comment: data,
        })
      );
      dispatch(productCommentStore.actions.addComment(data));
    } catch (error) {
      console.error("Error submitting review:", error);
      dispatch(commonStore.actions.setErrorMessage("Failed to submit review"));
    }

    // reset new review state
    setNewReview({
      rating: 5,
      comment: "",
      name: "",
    });
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

      // Shipping and summary will be recalculated via useEffect
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
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
    <Dialog
      open={display}
      onClose={() => dispatch(productStore.actions.setShowQuickView(false))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: "var(--background-component)",
        }}
      >
        <div className="p-1 flex justify-between items-center">
          <h2 className="text-xl text-[var(--foreground)] font-bold">
            {product?.name}
          </h2>
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() =>
              dispatch(productStore.actions.setShowQuickView(false))
            }
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          backgroundColor: "var(--background-component)",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {/* Content */}
        <div className="p-2 flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          <div className="w-full">
            <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4 h-80 mb-2">
              <img
                src={image ? IMGAES_URL + image : PRODUCT_PLACEHOLDER}
                alt={product?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {product?.images.map((img: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setImage(img)}
                  className={`w-16 h-16 rounded border-2 flex-shrink-0 ${
                    image === img ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={IMGAES_URL + img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="w-full flex flex-col gap-4">
          <div>
            <p className="text-2xl font-bold text-red-600">
              {formatPrice(product?.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
            <p className="text-sm text-[var(--foreground)]">
              {product?.salesCount.toLocaleString()} {t("marketplace.sold")}
            </p>
          </div>
          <Divider className="my-2" />
          <p className="text-[var(--foreground)]">{product?.description}</p>

          {/* Specifications Table */}
          <div className="mt-2 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="bg-[var(--background)]">
                  <td className="px-4 py-2 font-medium text-[var(--foreground)]">
                    {t("marketplace.category")}
                  </td>
                  <td className="px-4 py-2 text-[var(--foreground)]">
                    {product?.category.name}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-[var(--foreground)]">
                    {t("marketplace.inStock")}
                  </td>
                  <td className="px-4 py-2 text-[var(--foreground)]">
                    {product?.stockQuantity} units
                  </td>
                </tr>
                <tr className="bg-[var(--background)]">
                  <td className="px-4 py-2 font-medium text-[var(--foreground)]">
                    {t("marketplace.Dimensions")}
                  </td>
                  <td className="px-4 py-2 text-[var(--foreground)]">
                    {product?.length} x {product?.width} x {product?.height} cm
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-[var(--foreground)]">
                    {t("marketplace.Weight")}
                  </td>
                  <td className="px-4 py-2 text-[var(--foreground)]">
                    {product?.weight} gram
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-30 flex-shrink-0">
            <div className="flex items-center w-fit rounded-lg border border-gray-300 overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                –
              </button>

              <input
                type="number"
                className="w-14 h-10 text-center border-x border-gray-300 focus:outline-none appearance-none text-[var(--foreground)]"
                value={quantity}
                min={1}
                max={product?.stockQuantity}
                readOnly
              />

              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                onClick={() =>
                  setQuantity(Math.min(product?.stockQuantity, quantity + 1))
                }
                disabled={quantity >= product?.stockQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:cursor-pointer"
            onClick={() => {
              handleQuantityChange(product?.id, product?.price, quantity);
              dispatch(productStore.actions.setShowQuickView(false));
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>Add to Cart</span>
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={toggleFavorite}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                product?.isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-[var(--foreground)]"
              }
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4 text-[var(--foreground)]">
            <b>{t("marketplace.rating&review")}</b>
          </h3>
          <div className="flex items-center gap-4 mb-6">
            {/* Rating info */}
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--foreground)]">
                {product?.rating.toFixed(1)}
              </div>
              <div className="flex justify-center">
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
              <div className="text-sm text-gray-400">
                {product?.amountRating} {t("marketplace.reviews")}
              </div>
            </div>

            {/* Rating bar */}
            <div className="flex-grow">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = comments.filter(
                  (r: any) => Math.floor(r?.rating) === star
                ).length;
                const percentage =
                  comments.length > 0 ? (count / comments.length) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 w-16">
                      <span>{star}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-yellow-400"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="flex-grow bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-xs text-gray-500">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Comment */}
          <div
            className="border rounded-lg p-4 mb-6"
            style={{ borderColor: "#e0e0e0" }}
          >
            <h4 className="font-medium mb-3 text-[var(--foreground)]">
              <b>{t("marketplace.writeReview")}</b>
            </h4>

            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
                  {t("marketplace.yourName")}
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  style={{ borderColor: "#e0e0e0" }}
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
                  {t("marketplace.rating")}
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={
                          star <= newReview.rating ? "currentColor" : "none"
                        }
                        stroke="currentColor"
                        className={
                          star <= newReview.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
                  {t("marketplace.yourReview")}
                </label>
                <textarea
                  className="w-full p-2 border rounded min-h-24"
                  style={{ borderColor: "#e0e0e0" }}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder={t("marketplace.sharingYourExperience")}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                {t("marketplace.submit")}
              </button>
            </form>
          </div>

          {/* Review Comments */}
          <div className="space-y-6">
            {comments.map((review: any) => (
              <div
                key={review?.id}
                className="border-b pb-4"
                style={{ borderColor: "#e0e0e0" }}
              >
                <div className="flex justify-between">
                  <div className="font-medium text-[var(--foreground)]">
                    <b>{review?.author}</b>
                  </div>
                  <div className="text-sm text-[var(--foreground)]">
                    {new Date(review?.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div className="flex my-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i < review?.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={
                        i < review?.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-[var(--foreground)]">{review?.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
