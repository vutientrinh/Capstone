import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "notification";
export const resetState = createAction(`${name}/RESET_STATE`);
interface Filter {
  messageType: string | null;
}

const initialState = {
  notifications: [] as any[],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  hasMore: true,
  // filter:
  // * LIKE_POST,
  // COMMENT_POST,
  // COMMENT_LIKED,
  // * FOLLOW_USER,
  // * FRIEND_REQUEST,
  // FRIEND_REQUEST_ACCEPTED
  filter: null as Filter | null,
};

const notificationSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setNotifications(
      state,
      action: PayloadAction<{
        notifications: any[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { notifications, currentPage, totalPages } = action.payload;

      state.loading = false;
      state.currentPage = currentPage;
      state.totalPages = totalPages;

      if (currentPage === 1) {
        state.notifications = notifications;
      } else {
        // Check if the posts already exist in the state
        const existingPosts = state.notifications.map((post) => post.id);
        const nowNot = notifications.filter(
          (post) => !existingPosts.includes(post.id)
        );
        state.notifications = [...state.notifications, ...nowNot];
      }

      state.hasMore = currentPage < totalPages;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // notification
    readAllNotifications(state) {
      state.notifications = state.notifications.map((notification) => {
        return { ...notification, isRead: true };
      });
      localStorage.setItem("notUnRead", "0");
      window.dispatchEvent(new Event("refreshNotifications"));
    },
    // filter
    setFilter(state, action: PayloadAction<Filter | null>) {
      state.filter = action.payload;
    },
    resetFilter(state) {
      state.filter = initialState.filter;
    },
    resetPagination(state) {
      state.currentPage = initialState.currentPage;
      state.totalPages = initialState.totalPages;
      state.hasMore = initialState.hasMore;
    },
    appendNotification(state, action: PayloadAction<any>) {
      if (
        state.filter?.messageType &&
        action.payload.messageType !== state.filter.messageType
      ) {
        return;
      }
      state.notifications = [action.payload, ...state.notifications];
      const notUnRead = state.notifications.filter(
        (notification) => !notification.isRead
      ).length;
      localStorage.setItem("notUnRead", notUnRead.toString());
      window.dispatchEvent(new Event("incrementNotifications"));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getNotifications = createAction(
  `${name}/GET_NOTIFICATIONS`,
  (pageNum: any, filter: Filter) => ({
    payload: { pageNum, filter },
  })
);

//selectors
export const selectState = (state: any) => state[name];
export const selectNotifications = createSelector(
  selectState,
  (state) => state.notifications
);
export const selectFilter = createSelector(
  selectState,
  (state) => state.filter
);

// Pagination
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

export const { actions } = notificationSlice;
export default notificationSlice;
