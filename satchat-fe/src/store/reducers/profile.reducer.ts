import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "profile";
export const resetState = createAction(`${name}/RESET_STATE`);

const initialState = {
  currentUser: {} as any,
  friends: {
    data: [] as any[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasMore: true,
      loading: false,
    },
  },
  friendRequests: {
    data: [] as any[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasMore: true,
      loading: false,
    },
  },
  suggestedFriends: {
    data: [] as any[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasMore: true,
      loading: false,
    },
  },
};

const profileSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
    },
    setFriends(state, action: PayloadAction<any>) {
      state.friends.data = action.payload;
    },
    appendFriends(state, action: PayloadAction<any>) {
      const newFriends = action.payload;
      state.friends.data = [...state.friends.data, ...newFriends];
    },
    setFriendRequests(state, action: PayloadAction<any>) {
      state.friendRequests.data = action.payload;
    },
    appendFriendRequests(state, action: PayloadAction<any>) {
      const newFriends = action.payload;
      state.friendRequests.data = [...state.friendRequests.data, ...newFriends];
    },
    setFriendSuggested(state, action: PayloadAction<any>) {
      state.suggestedFriends.data = action.payload;
    },
    // friend
    removeFriend(state, action: PayloadAction<any>) {
      const userId = action.payload;
      state.friends.data = state.friends.data.filter(
        (friend) => friend.id !== userId
      );
    },
    // suggested friend
    addFriend(state, action: PayloadAction<any>) {
      const receiverId = action.payload;
      state.suggestedFriends.data = state.suggestedFriends.data.filter(
        (suggestedFriend) => suggestedFriend.id !== receiverId
      );
    },
    // friend request
    acceptFriendRequest(state, action: PayloadAction<any>) {
      const { id } = action.payload;
      const request = state.friendRequests.data.find(
        (request) => request.requestId === id
      );
      if (request) {
        // state.friends.push(request);
        state.friendRequests.data = state.friendRequests.data.filter(
          (request) => request.requestId !== id
        );
      }
    },
    removeFriendRequest(state, action: PayloadAction<any>) {
      const id = action.payload;
      state.friendRequests.data = state.friendRequests.data.filter(
        (request) => request.id !== id
      );
    },
    // Pagination
    setPaginationFriends(
      state,
      action: PayloadAction<{
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
      }>
    ) {
      const { currentPage, totalPages, hasMore } = action.payload;
      state.friends.pagination.currentPage = currentPage;
      state.friends.pagination.totalPages = totalPages;
      state.friends.pagination.hasMore = hasMore;
      state.friends.pagination.loading = false;
    },
    setPaginationFriendRequests(
      state,
      action: PayloadAction<{
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
      }>
    ) {
      const { currentPage, totalPages, hasMore } = action.payload;
      state.friendRequests.pagination.currentPage = currentPage;
      state.friendRequests.pagination.totalPages = totalPages;
      state.friendRequests.pagination.hasMore = hasMore;
      state.friendRequests.pagination.loading = false;
    },
    setPaginationSuggestedFriends(
      state,
      action: PayloadAction<{
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
      }>
    ) {
      const { currentPage, totalPages, hasMore } = action.payload;
      state.suggestedFriends.pagination.currentPage = currentPage;
      state.suggestedFriends.pagination.totalPages = totalPages;
      state.suggestedFriends.pagination.hasMore = hasMore;
      state.suggestedFriends.pagination.loading = false;
    },
    // update current user
    updateCurrentUser(state, action: PayloadAction<any>) {
      const { id, ...rest } = action.payload;
      state.currentUser = { ...state.currentUser, ...rest };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// actions
export const getCurrentUser = createAction(`${name}/GET_CURRENT_USER`);
export const getFriends = createAction(
  `${name}/GET_FRIENDS`,
  (userId: any, pageNum?: any) => ({
    payload: { userId, pageNum },
  })
);
export const getFriendRequests = createAction(
  `${name}/GET_FRIEND_REQUESTS`,
  (userId: any, pageNum?: any) => ({
    payload: { userId, pageNum },
  })
);
export const getSuggestedFriends = createAction(
  `${name}/GET_SUGGESTED_FRIENDS`
);

// selectors
export const selectState = (state: any) => state[name];
export const selectCurrentUser = createSelector(
  selectState,
  (state) => state.currentUser
);

// Get friends and friend requests
export const selectFriends = createSelector(
  selectState,
  (state) => state.friends.data
);
export const selectFriendRequests = createSelector(
  selectState,
  (state) => state.friendRequests.data
);
export const selectSuggestedFriends = createSelector(
  selectState,
  (state) => state.suggestedFriends.data
);

// get pagination
export const selectPaginationFriends = createSelector(
  selectState,
  (state) => state.friends.pagination
);
export const selectPaginationFriendRequests = createSelector(
  selectState,
  (state) => state.friendRequests.pagination
);
export const selectPaginationSuggestedFriends = createSelector(
  selectState,
  (state) => state.suggestedFriends.pagination
);

export const { actions } = profileSlice;
export default profileSlice;
