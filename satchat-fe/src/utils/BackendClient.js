import { httpClient, springAiClient } from "../config/httpClient";
import { getCookie } from "cookies-next";
import { endpoints } from "../utils/endpoints";
import { TOKEN_GHN } from "@/global-config";

class BackendClient {
  constructor() {
    this.jwt = "";
  }

  // Method /auth (server-side & httpClient)
  login = async (loginRequestPayload) => {
    return httpClient.post(endpoints.auth.login, loginRequestPayload, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  logout = async () => {
    return httpClient.post(
      endpoints.auth.logout,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  register = async (registerRequestPayload, info) => {
    const { firstname, lastname, websiteurl, bio } = info;
    return httpClient.post(endpoints.auth.register, registerRequestPayload, {
      params: {
        firstname,
        lastname,
        websiteurl,
        bio,
      },
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  introspect = async () => {
    return httpClient.post(
      endpoints.auth.introspect,
      { token: getCookie("token") },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  refreshToken = async () => {
    return httpClient.post(
      endpoints.auth.refreshToken,
      getCookie("refreshToken"),
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /users (server-side & httpClient)
  getUserByToken = async () => {
    return httpClient.get(endpoints.user.getByToken, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getUserByUserName = async (userName) => {
    return httpClient.get(
      `${endpoints.user.getByUserName.replace("{userName}", userName)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getUserById = async (userId) => {
    return httpClient.get(
      `${endpoints.user.getById.replace("{userId}", userId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  setAvatar = async (avatar) => {
    const formData = new FormData();
    formData.append("file", avatar);

    return httpClient.put(`${endpoints.user.setAvatar}`, formData, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "multipart/form-data",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  updateUser = async (payload) => {
    const { avatar, cover, firstName, lastName, bio, websiteUrl } = payload;
    return httpClient.put(endpoints.user.updateUser, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  setCover = async (cover) => {
    const formData = new FormData();
    formData.append("file", cover);

    return httpClient.put(`${endpoints.user.setCover}`, formData, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "multipart/form-data",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method /posts (server-side & httpClient)
  getAllPosts = async () => {
    return httpClient.get(endpoints.post.getAllPosts, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getPostsPerPage = async (page, filter) => {
    let type = filter?.type || null;
    let topicName = filter?.topicName || null;
    let authorId = filter?.authorId || null;
    let keyword = filter?.keyword || null;
    return httpClient.get(endpoints.post.getAllPosts, {
      params: { page, type, topicName, authorId, keyword },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getPostById = async (postId) => {
    return httpClient.get(
      `${endpoints.post.getById.replace("{postId}", postId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  createNewPost = async (postRequestPayload) => {
    const formData = new FormData();
    formData.append("content", postRequestPayload.content);
    formData.append("authorId", postRequestPayload.authorId);
    formData.append("topicId", postRequestPayload.topicId);
    if (postRequestPayload.images && postRequestPayload.images.length > 0) {
      postRequestPayload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    return httpClient.post(`${endpoints.post.create}`, formData, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "multipart/form-data",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  deletePost = async (postId) => {
    return httpClient.delete(
      `${endpoints.post.delete.replace("{postId}", postId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };
  updatePost = async (postId, postRequestPayload) => {
    const formData = new FormData();
    formData.append("content", postRequestPayload.content);
    formData.append("topicId", postRequestPayload.topicId);
    formData.append("status", postRequestPayload.status);
    formData.append("type", postRequestPayload.type);
    if (postRequestPayload.images && postRequestPayload.images.length > 0) {
      postRequestPayload.images.forEach((file) => {
        formData.append("images", file);
      });
    }
    return httpClient.put(
      `${endpoints.post.update.replace("{postId}", postId)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "multipart/form-data",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  changeStatusPost = async (postId, status) => {
    return httpClient.post(
      `${endpoints.post.setStatus.replace("{postId}", postId)}`,
      {},
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Methos /posts/.../{like, unlike} (server-side & httpClient)
  likePost = async (postId) => {
    return httpClient.post(
      `${endpoints.post.like.replace("{postId}", postId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  unLikePost = async (postId) => {
    return httpClient.delete(
      `${endpoints.post.unlike.replace("{postId}", postId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /posts/.../bookmark (server-side & httpClient)
  bookmarkPost = async (payload) => {
    return httpClient.post(`${endpoints.post.bookmark}`, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  unBookmarkPost = async (payload) => {
    return httpClient.delete(`${endpoints.post.unBookmark}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method /comments (server-side & httpClient)
  getCommentsByPostId = async (postId) => {
    return httpClient.get(
      `${endpoints.comment.getByPostId.replace("{postId}", postId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  likeComment = async (commentId) => {
    return httpClient.post(
      `${endpoints.comment.like.replace("{commentId}", commentId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  unLikeComment = async (commentId) => {
    return httpClient.post(
      `${endpoints.comment.unlike.replace("{commentId}", commentId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  deleteComment = async (commentId) => {
    return httpClient.delete(
      `${endpoints.comment.delete.replace("{commentId}", commentId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  /**
   * @property {string} postId
   * @property {string} content
   */
  createComment = async (commentRequestPayload) => {
    return httpClient.post(
      endpoints.comment.createComment,
      commentRequestPayload,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  setStatusComment = async (commentId, status) => {
    return httpClient.post(
      `${endpoints.comment.setStatus.replace("{commentId}", commentId)}`,
      {},
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /topics (server-side & httpClient)
  getAllTopics = async (page, search) => {
    let searchQuery = search || null;
    return httpClient.get(endpoints.topic.getAllTopics, {
      params: { page, search: searchQuery },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  updateTopic = async (id, topic) => {
    return httpClient.put(
      `${endpoints.topic.updateTopic.replace("{topicId}", id)}`,
      topic,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  createTopic = async (topic) => {
    return httpClient.post(`${endpoints.topic.createTopic}`, topic, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  deleteTopic = async (id) => {
    return httpClient.delete(
      `${endpoints.topic.deleteTopic.replace("{topicId}", id)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /conversation (server-side & httpClient)
  getUnseenMessages = async (fromUserId) => {
    let url = endpoints.conversation.getUnseenMessages;
    if (fromUserId) {
      url = url + `/${fromUserId}`;
    }
    return httpClient.get(url, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  setReadMessages = async (chatMessages) => {
    return httpClient.put(
      endpoints.conversation.setReadMessages,
      chatMessages,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getFriends = async () => {
    return httpClient.get(endpoints.conversation.getFriends, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getMessageBefore = async (messageId, convId, page) => {
    return httpClient.get(endpoints.conversation.getMessageBefore, {
      params: { messageId, convId, page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method /notifications (server-side & httpClient)
  getNotifications = async (page, filter) => {
    let messageType = filter?.messageType || null;
    return httpClient.get(endpoints.notification.getNotifications, {
      params: { page, messageType },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  readAllNotifications = async () => {
    return httpClient.post(
      endpoints.notification.readAllNotifications,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /users/.../friend (server-side & httpClient)
  getAllFriends = async (userId, page) => {
    return httpClient.get(
      `${endpoints.user.getAllFriends.replace("{userId}", userId)}`,
      {
        params: { page },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getFriendRequests = async (userId, page) => {
    return httpClient.get(
      `${endpoints.user.getFriendRequests.replace("{userId}", userId)}`,
      {
        params: { page },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getSuggestedFriends = async () => {
    return httpClient.get(endpoints.user.getSuggestedFriends, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  trendingPosts = async (page, filter) => {
    let type = filter?.type || null;
    let topicName = filter?.topicName || null;
    let authorId = filter?.authorId || null;
    let keyword = filter?.keyword || null;
    return httpClient.get(endpoints.post.trendingPosts, {
      params: { page, type, topicName, authorId, keyword },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  removeFriend = async (friendId) => {
    return httpClient.delete(
      `${endpoints.user.removeFriend.replace("{userId}", friendId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  acceptFriendRequest = async (requestId) => {
    return httpClient.post(
      `${endpoints.user.acceptFriendRequest.replace("{userId}", requestId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  createRequest = async (payload) => {
    return httpClient.post(`${endpoints.user.createRequest}`, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method /posts/saved (server-side & httpClient)
  getSavedPosts = async (page) => {
    return httpClient.get(endpoints.post.getSavedPosts, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method / products (server-side & httpClient)
  getProductsPerPage = async (page, filter) => {
    // filters
    let search = filter?.filters.search || null;
    let category = filter?.filters.category || null;
    let minPrice = filter?.filters.minPrice || null;
    let maxPrice = filter?.filters.maxPrice || null;
    let rating = filter?.filters.rating || null;
    let inStock = filter?.filters.inStock || null;
    // sort
    let field = filter?.sort.field || null;
    let direction = filter?.sort.direction || null;
    return httpClient.get(endpoints.product.getAllProducts, {
      params: {
        page,
        search,
        category,
        minPrice,
        maxPrice,
        rating,
        inStock,
        field,
        direction,
      },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getCommentByProduct = async (productId) => {
    return httpClient.get(
      `${endpoints.product.getCommentByProduct.replace(
        "{productId}",
        productId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  createProductComment = async (payload) => {
    return httpClient.post(`${endpoints.product.createComment}`, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  likeProduct = async (payload) => {
    return httpClient.post(endpoints.product.like, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  unlikeProduct = async (payload) => {
    return httpClient.post(endpoints.product.unlike, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getLikedProducts = async (page) => {
    return httpClient.get(endpoints.product.getLikedProducts, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  createProduct = async (payload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("weight", payload.weight);
    formData.append("width", payload.width);
    formData.append("height", payload.height);
    formData.append("length", payload.length);
    formData.append("categoryId", payload.categoryId);
    formData.append("stockQuantity", payload.stockQuantity);
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    return httpClient.post(endpoints.product.createProduct, formData, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "multipart/form-data",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  updateProduct = async (productId, payload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("weight", payload.weight);
    formData.append("width", payload.width);
    formData.append("height", payload.height);
    formData.append("length", payload.length);
    formData.append("categoryId", payload.categoryId);
    formData.append("stockQuantity", payload.stockQuantity);
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    return httpClient.put(
      `${endpoints.product.updateProduct.replace("{productId}", productId)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "multipart/form-data",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  setVisible = async (productId, visible) => {
    return httpClient.post(
      `${endpoints.product.setVisible.replace("{productId}", productId)}`,
      {},
      {
        params: { visible },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "multipart/form-data",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  deleteProductComment = async (commentId) => {
    return httpClient.delete(
      `${endpoints.product.deleteComment.replace("{commentId}", commentId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /cart (server-side & httpClient)
  getCart = async (payload) => {
    const { userId } = payload;
    return httpClient.get(
      `${endpoints.cart.getCart.replace("{userId}", userId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  addToCart = async (payload) => {
    const { userId, productId, price, quantity } = payload;
    return httpClient.post(
      `${endpoints.cart.addToCart.replace("{userId}", userId)}`,
      { productId, price, quantity },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  clearCart = async (userId) => {
    return httpClient.delete(
      `${endpoints.cart.clearCart.replace("{userId}", userId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /address (server-side & httpClient)
  getAddress = async (payload) => {
    return httpClient.get(endpoints.address.getAddress, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getProvinces = async () => {
    return httpClient.get(endpoints.address.getProvinces, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        Token: TOKEN_GHN,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getDistricts = async (provinceId) => {
    return httpClient.get(
      `${endpoints.address.getDistricts.replace("{provinceId}", provinceId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          Token: TOKEN_GHN,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getWards = async (districtId) => {
    return httpClient.get(
      `${endpoints.address.getWards.replace("{districtId}", districtId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          Token: TOKEN_GHN,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  createAddress = async (payload) => {
    return httpClient.post(endpoints.address.createAddress, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  setDefaultAddress = async (addressId) => {
    return httpClient.post(
      `${endpoints.address.setDefaultAddress.replace(
        "{addressId}",
        addressId
      )}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  deleteAddress = async (addressId) => {
    return httpClient.delete(
      `${endpoints.address.deleteAddress.replace("{addressId}", addressId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  shippingFee = async (payload) => {
    return httpClient.post(endpoints.address.getShippingFee, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        Token: TOKEN_GHN,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  createOrder = async (payload) => {
    return httpClient.post(endpoints.order.createOrder, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        Token: TOKEN_GHN,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  cancelOrder = async (orderId) => {
    return httpClient.delete(
      `${endpoints.order.cancelOrder.replace("{orderId}", orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getLstOrders = async (page, filter) => {
    let status = filter?.status || null;
    let customerId = filter?.customerId || null;
    console.log("customerId", customerId);
    console.log("status", status);
    return httpClient.get(endpoints.order.getLstOrders, {
      params: { page, status, customerId },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  rePayment = async (orderId) => {
    return httpClient.post(
      `${endpoints.order.rePayment.replace("{orderId}", orderId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /admin (server-side & httpClient)
  getAllProductsAdmin = async (page, search) => {
    let searchQuery = search || null;
    return httpClient.get(endpoints.admin.getAllProducts, {
      params: { page, search: searchQuery },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getAllCategories = async (page) => {
    return httpClient.get(endpoints.admin.getAllCategories, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getAllPostComments = async (page) => {
    return httpClient.get(endpoints.admin.getAllPostComments, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getAllProductComments = async (page, search) => {
    let searchQuery = search || null;
    return httpClient.get(endpoints.admin.getAllProductComments, {
      params: { page, search: searchQuery },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getAllUsers = async (page, search) => {
    let searchQuery = search || null;
    return httpClient.get(endpoints.admin.getAllUsers, {
      params: { page, search: searchQuery },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  setStatusUser = async (userId, status) => {
    return httpClient.post(
      `${endpoints.admin.setStatusUser.replace("{userId}", userId)}`,
      {},
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getOrders = async (page, filter) => {
    let status = filter?.status || null;
    let searchQuery = filter?.search || null;
    return httpClient.get(endpoints.admin.getOrders, {
      params: { page, status, search: searchQuery },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  setShippingStatus = async (orderId, status) => {
    return httpClient.post(
      `${endpoints.order.setShippingStatus.replace("{orderId}", orderId)}`,
      {},
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  getAnalysis = async () => {
    return httpClient.get(endpoints.admin.getAnalysis, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getTopSellingProducts = async (page) => {
    return httpClient.get(endpoints.admin.getTopSellingProducts, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getTopCustomers = async (page) => {
    return httpClient.get(endpoints.admin.getTopCustomers, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getTokenPrint = async (orderCode) => {
    return httpClient.post(
      `${endpoints.order.getTokenPrint.replace("{orderCode}", orderCode)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /categories (server-side & httpClient)
  getOptionsCategories = async () => {
    return httpClient.get(endpoints.category.getAllCategories, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  createCategogy = async (payload) => {
    return httpClient.post(endpoints.category.createCategory, payload, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  updateCategogy = async (categoryId, payload) => {
    return httpClient.put(
      `${endpoints.category.updateCategory.replace(
        "{categoryId}",
        categoryId
      )}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  deleteCategogy = async (categoryId) => {
    return httpClient.delete(
      `${endpoints.category.deleteCategory.replace(
        "{categoryId}",
        categoryId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /rec (server-side & httpClient)
  getRecPosts = async (page) => {
    return httpClient.get(endpoints.rec.getRecPosts, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getRecProducts = async (page) => {
    return httpClient.get(endpoints.rec.getRecProducts, {
      params: { page },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  getRecPostsByUserId = async (page, userId) => {
    return httpClient.get(
      `${endpoints.rec.getRecPostsByUserId.replace("{userId}", userId)}`,
      {
        params: { page },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /springai (server-side & httpClient)
  ask = async (userId, question) => {
    return springAiClient.post(
      `${endpoints.springAi.ask.replace("{userId}", userId)}`,
      question,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  checkPolicies = async (input) => {
    return springAiClient.post(endpoints.springAi.checkPolicies, input, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method /search (server-side & httpClient)
  search = async (query) => {
    return httpClient.get(endpoints.search.search, {
      params: { query, top_k: 5 },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        "Accept-Language": getCookie("defaultLocale") || "en-US",
      },
    });
  };

  // Method /images (server-side & httpClient)
  getImages = async (userId) => {
    return httpClient.get(
      `${endpoints.post.getImages.replace("{userId}", userId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /recovery (server-side & httpClient)
  sendRecoveryEmail = async (email) => {
    return httpClient.post(
      endpoints.recovery.sendRecoveryEmail,
      {},
      {
        params: { email },
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  // Method /follow (server-side & httpClient)
  followUser = async (userId) => {
    return httpClient.post(
      `${endpoints.user.followUser.replace("{userId}", userId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };

  unFollowUser = async (userId) => {
    return httpClient.delete(
      `${endpoints.user.unFollowUser.replace("{userId}", userId)}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
          "Accept-Language": getCookie("defaultLocale") || "en-US",
        },
      }
    );
  };
}

let backendClient = new BackendClient();

export default backendClient;
