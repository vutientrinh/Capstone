import { deleteComment } from "@/store/reducers/post.reducer";

const VERSION_PREFIX = "/api";

export const endpoints = {
  webSocketUrl: "/ws",
  auth: {
    login: `${VERSION_PREFIX}/auth/login`,
    register: `${VERSION_PREFIX}/auth/register`,
    logout: `${VERSION_PREFIX}/auth/signout`,
    refreshToken: `${VERSION_PREFIX}/auth/refresh-token`,
    introspect: `${VERSION_PREFIX}/auth/introspect`,
  },

  user: {
    getByToken: `${VERSION_PREFIX}/users/profile`,
    getById: `${VERSION_PREFIX}/users/profile/{userId}`,
    getByUserName: `${VERSION_PREFIX}/users/profile/accounts/{userName}`,
    getAllFriends: `${VERSION_PREFIX}/users/{userId}/get-friends`,
    getFriendRequests: `${VERSION_PREFIX}/users/{userId}/get-friends-request`,
    removeFriend: `${VERSION_PREFIX}/users/{userId}/delete-friend`,
    acceptFriendRequest: `${VERSION_PREFIX}/users/{userId}/accept-friend`,
    getSuggestedFriends: `${VERSION_PREFIX}/users/suggested`,
    createRequest: `${VERSION_PREFIX}/users/create-request`,
    setAvatar: `${VERSION_PREFIX}/users/update-avatar`,
    setCover: `${VERSION_PREFIX}/users/update-cover`,
    updateUser: `${VERSION_PREFIX}/users/profile`,
    followUser: `${VERSION_PREFIX}/users/{userId}/follow`,
    unFollowUser: `${VERSION_PREFIX}/users/{userId}/unfollow`,
  },

  post: {
    getAllPosts: `${VERSION_PREFIX}/posts`,
    getById: `${VERSION_PREFIX}/posts/{postId}`,
    like: `${VERSION_PREFIX}/posts/{postId}/like`,
    unlike: `${VERSION_PREFIX}/posts/{postId}/unlike`,
    bookmark: `${VERSION_PREFIX}/posts/save`,
    unBookmark: `${VERSION_PREFIX}/posts/unsaved`,
    create: `${VERSION_PREFIX}/posts`,
    delete: `${VERSION_PREFIX}/posts/{postId}`,
    update: `${VERSION_PREFIX}/posts/{postId}`,
    getSavedPosts: `${VERSION_PREFIX}/posts/lst-saved`,
    trendingPosts: `${VERSION_PREFIX}/posts/trending`,
    getImages: `${VERSION_PREFIX}/posts/{userId}/images`,
    setStatus: `${VERSION_PREFIX}/posts/{postId}/post-status`,
  },
  media: {
    // TODO
  },

  topic: {
    getAllTopics: `${VERSION_PREFIX}/topic/all`,
    updateTopic: `${VERSION_PREFIX}/topic/{topicId}`,
    createTopic: `${VERSION_PREFIX}/topic`,
    deleteTopic: `${VERSION_PREFIX}/topic/{topicId}`,
  },

  notification: {
    getNotifications: `${VERSION_PREFIX}/notifications`,
    readAllNotifications: `${VERSION_PREFIX}/notifications/read-all`,
  },

  comment: {
    getByPostId: `${VERSION_PREFIX}/comments/{postId}`,
    createComment: `${VERSION_PREFIX}/comments/create`,
    like: `${VERSION_PREFIX}/comments/{commentId}/like`,
    unlike: `${VERSION_PREFIX}/comments/{commentId}/unlike`,
    delete: `${VERSION_PREFIX}/comments/{commentId}`,
    setStatus: `${VERSION_PREFIX}/comments/{commentId}/status`,
  },

  conversation: {
    getUnseenMessages: `${VERSION_PREFIX}/conversation/unseenMessages`,
    setReadMessages: `${VERSION_PREFIX}/conversation/setReadMessages`,
    getFriends: `${VERSION_PREFIX}/conversation/friends`,
    getMessageBefore: `${VERSION_PREFIX}/conversation/getMessagesBefore`,
  },

  product: {
    getAllProducts: `${VERSION_PREFIX}/products/all`,
    getCommentByProduct: `${VERSION_PREFIX}/products/comment/{productId}`,
    createComment: `${VERSION_PREFIX}/products/comment`,
    like: `${VERSION_PREFIX}/products/like`,
    unlike: `${VERSION_PREFIX}/products/unlike`,
    getLikedProducts: `${VERSION_PREFIX}/products/liked`,
    createProduct: `${VERSION_PREFIX}/products/create`,
    updateProduct: `${VERSION_PREFIX}/products/{productId}/update`,
    deleteProduct: `${VERSION_PREFIX}/products/{productId}/delete`,
    setVisible: `${VERSION_PREFIX}/products/{productId}/visible`,
    deleteComment: `${VERSION_PREFIX}/products/{commentId}/delete-comment`,
  },

  cart: {
    getCart: `${VERSION_PREFIX}/cart/{userId}`,
    addToCart: `${VERSION_PREFIX}/cart/{userId}/add`,
    clearCart: `${VERSION_PREFIX}/cart/{userId}/clear`,
  },

  address: {
    getAddress: `${VERSION_PREFIX}/address/all`,
    getProvinces: `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
    getDistricts: `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id={provinceId}`,
    getWards: `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id={districtId}`,
    createAddress: `${VERSION_PREFIX}/address/create`,
    setDefaultAddress: `${VERSION_PREFIX}/address/set-default/{addressId}`,
    deleteAddress: `${VERSION_PREFIX}/address/delete/{addressId}`,
    getShippingFee: `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
  },

  order: {
    createOrder: `${VERSION_PREFIX}/orders/create`,
    getLstOrders: `${VERSION_PREFIX}/orders/all`,
    setShippingStatus: `${VERSION_PREFIX}/orders/{orderId}/shipping-status`,
    cancelOrder: `${VERSION_PREFIX}/orders/{orderId}/cancel-order`,
    rePayment: `${VERSION_PREFIX}/orders/repayment/{orderId}`,
    getTokenPrint: `${VERSION_PREFIX}/orders/print-label/{orderCode}`,
    printPDF: `https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token={token}`,
  },

  admin: {
    getAllProducts: `${VERSION_PREFIX}/admin/get-products`,
    getAllCategories: `${VERSION_PREFIX}/admin/get-categories`,
    getAllPostComments: `${VERSION_PREFIX}/admin/get-post-comments`,
    getAllProductComments: `${VERSION_PREFIX}/admin/get-product-comments`,
    getAllUsers: `${VERSION_PREFIX}/admin/get-users`,
    setStatusUser: `${VERSION_PREFIX}/admin/{userId}/change-status`,
    getOrders: `${VERSION_PREFIX}/admin/get-orders`,
    getAnalysis: `${VERSION_PREFIX}/admin/analysis`,
    getTopSellingProducts: `${VERSION_PREFIX}/admin/top-products`,
    getTopCustomers: `${VERSION_PREFIX}/admin/top-customers`,
  },

  category: {
    getAllCategories: `${VERSION_PREFIX}/categories/all`,
    getCategoryById: `${VERSION_PREFIX}/categories/{categoryId}`,
    createCategory: `${VERSION_PREFIX}/categories/create`,
    updateCategory: `${VERSION_PREFIX}/categories/{categoryId}/update`,
    deleteCategory: `${VERSION_PREFIX}/categories/{categoryId}/delete`,
  },

  rec: {
    getRecPosts: `${VERSION_PREFIX}/rec/rec-posts`,
    getRecProducts: `${VERSION_PREFIX}/rec/rec-products`,
    getRecFriends: `${VERSION_PREFIX}/rec/rec-friends`,
    getRecPostsByUserId: `${VERSION_PREFIX}/rec/{userId}/rec-posts`,
    getRecProductsByUserId: `${VERSION_PREFIX}/rec/{userId}/rec-products`,
  },

  springAi: {
    ask: `${VERSION_PREFIX}/{userId}/ask`,
    checkPolicies: `${VERSION_PREFIX}/check-policy`,
  },

  search: {
    search: `${VERSION_PREFIX}/posts/search`,
  },

  recovery: {
    sendRecoveryEmail: `${VERSION_PREFIX}/auth/recovery`,
  },
};
