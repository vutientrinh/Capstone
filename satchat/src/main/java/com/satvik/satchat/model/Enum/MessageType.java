package com.satvik.satchat.model.Enum;

public enum MessageType {
  // Enum for Chatting
  CHAT,
  UNSEEN,
  FRIEND_ONLINE,
  FRIEND_OFFLINE,
  MESSAGE_DELIVERY_UPDATE,

  // Enum for Notification (Friend Request, Like/Comment Post, Follow, etc.)
  LIKE_POST,
  LIKE_COUNT,
  POST_COUNT,
  COMMENT_POST,
  COMMENT_POST_COUNT,
  COMMENT_LIKED,
  COMMENT_LIKED_COUNT,
  FOLLOW_USER,
  FOLLOW_COUNT,
  FRIEND_COUNT,
  FRIEND_REQUEST,
  FRIEND_REQUEST_ACCEPTED,
}
