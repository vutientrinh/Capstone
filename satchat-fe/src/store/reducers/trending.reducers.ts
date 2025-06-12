import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "trending";
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
  // filter
  filter: null as Filter | null,
};

const trendingSlice = createSlice({
  name,
  initialState,
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
    setFilter: (state, action: PayloadAction<Filter | null>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getPostsTrending = createAction(
  `${name}/GET_POSTS_TRENDING`,
  (pageNum: any, filter: Filter) => ({
    payload: { pageNum, filter },
  })
);

export const selectState = (state: any) => state[name];

// selectors
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
export const selectFilter = createSelector(
  selectState,
  (state) => state.filter
);

export const { actions } = trendingSlice;
export default trendingSlice;
