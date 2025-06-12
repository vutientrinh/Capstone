import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "post";
export const resetState = createAction(`${name}/RESET_STATE`);
interface Filter {
  // 0: TEXT; 1: MEDIA;
  type: any;
  topicName: any;
  authorId: any;
  keyword: any;
}
const initialState = {
  posts: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
  // Current post operation
  currentPost: {} as any,
  currentPostComments: [] as any[],
  displayCurrentPost: false,
  // filter
  filter: null as Filter | null,
};

const postSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    // posts page
    setPosts(state, action: PayloadAction<any>) {
      state.posts = action.payload;
    },
    fecthPostsPaging(
      state,
      action: PayloadAction<{
        posts: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { posts, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.posts = posts;
      } else {
        // Check if the posts already exist in the state
        const existingPosts = state.posts.map((post) => post.id);
        const newPosts = posts.filter(
          (post) => !existingPosts.includes(post.id)
        );
        state.posts = [...state.posts, ...newPosts];
      }

      state.hasMore = currentPage < totalPages;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    // post create
    createPost(state, action: PayloadAction<any>) {
      const post = action.payload;
      state.posts = [post, ...state.posts];
    },
    // post delete
    deletePost(state, action: PayloadAction<any>) {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    // post update
    updatePost(state, action: PayloadAction<any>) {
      const updatedPost = action.payload;
      state.posts = state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
    },
    // post like operation
    likePost(state, action: PayloadAction<any>) {
      const postId = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.hasLiked = true;
        post.likedCount += 1;
      }

      // Update current post if it's the same post
      if (state.currentPost.id === postId) {
        state.currentPost = post;
      }
    },
    unlikePost(state, action: PayloadAction<any>) {
      const postId = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.hasLiked = false;
        post.likedCount -= 1;
      }

      // Update current post if it's the same post
      if (state.currentPost.id === postId) {
        state.currentPost = post;
      }
    },
    setLikeCount(state, action: PayloadAction<any>) {
      const { postId, likedCount } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.likedCount = likedCount;
      }
    },
    // comment
    addComment(state, action: PayloadAction<any>) {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.commentCount += 1;
      }

      // check comment in current post and decrease comment count
      if (comment) {
        state.currentPost.commentCount += 1;
      }

      state.currentPostComments = [comment, ...state.currentPostComments];
    },
    likeComment(state, action: PayloadAction<any>) {
      const commentId = action.payload;
      const comment = state.currentPostComments.find(
        (comment) => comment.id === commentId
      );

      if (comment) {
        comment.hasLiked = true;
        comment.likedCount += 1;
      }
    },
    unlikeComment(state, action: PayloadAction<any>) {
      const commentId = action.payload;
      const comment = state.currentPostComments.find(
        (comment) => comment.id === commentId
      );

      if (comment) {
        comment.hasLiked = false;
        comment.likedCount -= 1;
      }
    },
    deleteComment(state, action: PayloadAction<any>) {
      const commentId = action.payload;
      const comment = state.currentPostComments.find(
        (comment) => comment.id === commentId
      );

      // check comment in post and decrease comment count
      if (comment) {
        const post = state.posts.find((post) => post.id === comment.postId);
        if (post) {
          post.commentCount -= 1;
        }
      }

      // check comment in current post and decrease comment count
      if (comment) {
        state.currentPost.commentCount -= 1;
      }

      // Update new state
      state.currentPostComments = state.currentPostComments.filter(
        (comment) => comment.id !== commentId
      );
    },
    // bookmark
    savePost(state, action: PayloadAction<any>) {
      const postId = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.hasSaved = true;
      }

      // Update current post if it's the same post
      if (state.currentPost.id === postId) {
        state.currentPost = post;
      }
    },
    unSavePost(state, action: PayloadAction<any>) {
      const postId = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.hasSaved = false;
      }

      // Update current post if it's the same post
      if (state.currentPost.id === postId) {
        state.currentPost = post;
      }
    },
    // current post
    setCurrentPost(state, action: PayloadAction<any>) {
      state.currentPost = action.payload;
    },
    setCurrentPostId(state, action: PayloadAction<any>) {
      const postId = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        state.currentPost = post;
      }
    },
    setDisplayCurrentPost(state, action: PayloadAction<boolean>) {
      state.displayCurrentPost = action.payload;
    },
    setCurrentPostComments(state, action: PayloadAction<any>) {
      state.currentPostComments = action.payload;
    },
    // filter
    setFilter(state, action: PayloadAction<Filter | null>) {
      state.filter = action.payload;
      state.currentPage = initialState.currentPage;
      state.posts = initialState.posts;
      state.hasMore = initialState.hasMore;
      state.loading = initialState.loading;
      state.totalPages = initialState.totalPages;
    },
    resetFilter(state) {
      state.filter = initialState.filter;
      state.currentPage = initialState.currentPage;
      state.posts = initialState.posts;
      state.hasMore = initialState.hasMore;
      state.loading = initialState.loading;
      state.totalPages = initialState.totalPages;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions: posts page
export const getPosts = createAction(
  `${name}/GET_POSTS`,
  (pageNum: any, filter: Filter) => ({
    payload: { pageNum, filter },
  })
);
export const getRecPosts = createAction(
  `${name}/GET_RECCOMMENDED_POSTS`,
  (pageNum: any) => ({
    payload: { pageNum },
  })
);

export const setCurrentPage = createAction(`${name}/GET_CURRENT_PAGE`);
export const setTotalPages = createAction(`${name}/GET_TOTAL_PAGES`);
export const loadMorePosts = createAction(`${name}/LOAD_MORE_POSTS`);
export const setHasMore = createAction(`${name}/SET_HAS_MORE`);

// actions: like post
export const likePost = createAction(`${name}/LIKE_POST`, (postId: any) => ({
  payload: postId,
}));
export const unlikePost = createAction(
  `${name}/UNLIKE_POST`,
  (postId: any) => ({
    payload: postId,
  })
);

// actions: comment
export const addComment = createAction(
  `${name}/ADD_COMMENT`,
  (postId: any, content: any) => ({
    payload: { postId, content },
  })
);

export const likeComment = createAction(
  `${name}/LIKE_COMMENT`,
  (commentId: any) => ({
    payload: commentId,
  })
);

export const unlikeComment = createAction(
  `${name}/UNLIKE_COMMENT`,
  (commentId: any) => ({
    payload: commentId,
  })
);

export const deleteComment = createAction(
  `${name}/DELETE_COMMENT`,
  (commentId: any) => ({
    payload: commentId,
  })
);

// actions: bookmark
export const savePost = createAction(
  `${name}/SAVE_POST`,
  (authorId: any, postId: any) => ({
    payload: { authorId, postId },
  })
);
export const unSavePost = createAction(
  `${name}/UNSAVE_POST`,
  (authorId: any, postId: any) => ({
    payload: { authorId, postId },
  })
);

// actions: delete post
export const deletePost = createAction(
  `${name}/DELETE_POST`,
  (postId: any) => ({
    payload: postId,
  })
);

// actions: current post
export const getCurrentPost = createAction(`${name}/GET_CURRENT_POST`); //*
export const getPostComments = createAction(
  `${name}/GET_POST_COMMENTS`,
  (postId: any) => ({ payload: postId })
); //*

export const selectState = (state: any) => state[name];

// selectors posts page
export const selectPosts = createSelector(selectState, (state) => state.posts);
export const selectCurrentPage = createSelector(
  selectState,
  (state) => state.currentPage
);
export const selectTotalPages = createSelector(
  selectState,
  (state) => state.totalPages
);
export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);
export const selectHasMore = createSelector(
  selectState,
  (state) => state.hasMore
);

// selectors current post
export const selectCurrentPost = createSelector(
  selectState,
  (state) => state.currentPost
);
export const selectDisplayCurrentPost = createSelector(
  selectState,
  (state) => state.displayCurrentPost
);
export const selectCurrentPostComments = createSelector(
  selectState,
  (state) => state.currentPostComments
);

// selectors filter
export const selectFilter = createSelector(
  selectState,
  (state) => state.filter
);

export const { actions } = postSlice;
export default postSlice;
