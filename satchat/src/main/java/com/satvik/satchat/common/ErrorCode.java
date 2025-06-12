package com.satvik.satchat.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
  UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
  INVALID_KEY(1001, "Invalid key provided", HttpStatus.BAD_REQUEST),
  INVALID_USERNAME(1003, "Username must be at least 6 characters", HttpStatus.BAD_REQUEST),
  INVALID_PASSWORD(1004, "Password must be at least 6 characters", HttpStatus.BAD_REQUEST),
  USERNAME_IS_MISSING(1010, "Please enter username", HttpStatus.BAD_REQUEST),
  EMAIL_EXISTED(1008, "Email existed, please choose another one", HttpStatus.BAD_REQUEST),
  USER_EXISTED(1009, "Username existed, please choose another one", HttpStatus.BAD_REQUEST),
  USERNAME_ALREADY_TAKEN(1029, "Username already taken", HttpStatus.BAD_REQUEST),
  USER_NOT_EXISTED_AFTER_UPDATE(1030, "User not existed after update", HttpStatus.BAD_REQUEST),
  USER_STATUS_CHANGED_INVALID(1031, "User status changed invalid", HttpStatus.BAD_REQUEST),
  UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
  UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
  ROLE_NOT_FOUND(1005, "Role not found", HttpStatus.BAD_REQUEST),
  USER_NOT_ALLOWED(
      1032,
      "Your account has been restricted. Please contact your administrator for further assistance.",
      HttpStatus.FORBIDDEN),
  PASSWORD_NOT_MATCH(1033, "Password not match", HttpStatus.BAD_REQUEST),
  USER_NOT_EXISTED(1034, "User not existed", HttpStatus.BAD_REQUEST),
  PROFILE_UPDATE_FAILED(1035, "Profile update failed", HttpStatus.BAD_REQUEST),
  PROFILE_DELETE_FAILED(1036, "Profile delete failed", HttpStatus.BAD_REQUEST),
  PROFILE_ACTIVATE_FAILED(1037, "Profile activate failed", HttpStatus.BAD_REQUEST),
  TOPIC_EXISTED(1038, "Topic existed", HttpStatus.BAD_REQUEST),
  TOPIC_NOT_EXISTED(1039, "Topic not existed", HttpStatus.BAD_REQUEST),
  FAILED_TO_DELETE_TOPIC(1040, "Failed to delete topic", HttpStatus.BAD_REQUEST),
  TOPIC_NAME_REQUIRED(1041, "Topic Name is required", HttpStatus.BAD_REQUEST),
  TOPIC_COLOR_REQUIRED(1042, "Topic Color is required", HttpStatus.BAD_REQUEST),
  INVALID_COLOR_FORMAT(1043, "Invalid color format", HttpStatus.BAD_REQUEST),
  POST_CREATION_FAILED(1044, "Post creation failed", HttpStatus.BAD_REQUEST),
  CONTENT_LENGTH_INVALID(1045, "Content must have at least 1 character", HttpStatus.BAD_REQUEST),
  POST_NOT_EXISTED(1046, "Post not existed", HttpStatus.BAD_REQUEST),
  POST_DELETION_FAILED(1047, "Post deletion failed", HttpStatus.BAD_REQUEST),
  POST_SAVED_EXISTED(1048, "Post saved existed", HttpStatus.BAD_REQUEST),
  POST_SAVED_NOT_EXISTED(1049, "Post saved not existed", HttpStatus.BAD_REQUEST),
  POST_LIKED_EXISTED(1050, "Post liked existed", HttpStatus.BAD_REQUEST),
  POST_LIKED_NOT_EXISTED(1051, "Post liked not existed", HttpStatus.BAD_REQUEST),
  TOKEN_REFRESH_EXCEPTION(
      1052, "Refresh token was expired. Please make a new Sign In request", HttpStatus.FORBIDDEN),
  TOKEN_REFRESH_IS_NOT_IN_DATABASE(1053, "Token is not in database", HttpStatus.BAD_REQUEST),
  ENTITY_IS_NOT_FOUND_IN_DATABASE(1054, "Entity is not found in database", HttpStatus.BAD_REQUEST),
  NOT_BLANK(1055, "Field cannot be blank", HttpStatus.BAD_REQUEST),
  INVALID_PAGINATION_PARAMS(1056, "Invalid pagination params", HttpStatus.BAD_REQUEST),
  NOTIFICATION_NOT_CREATED(1057, "Notification not created", HttpStatus.BAD_REQUEST),
  NOTIFICATION_NOT_EXISTED(1058, "Notification not existed", HttpStatus.BAD_REQUEST),
  COMMENT_CREATION_FAILED(1059, "Comment creation failed", HttpStatus.BAD_REQUEST),
  COMMENT_NOT_EXISTED(1060, "Comment not existed", HttpStatus.BAD_REQUEST),
  COMMENT_UPDATE_FAILED(1061, "Comment update failed", HttpStatus.BAD_REQUEST),
  COMMENT_DELETE_FAILED(1062, "Comment delete failed", HttpStatus.BAD_REQUEST),
  COMMENT_ALREADY_DELETED(1063, "Comment already deleted", HttpStatus.BAD_REQUEST),
  USER_ALREADY_LIKED_COMMENT(1064, "User already liked this comment", HttpStatus.BAD_REQUEST),
  USER_NOT_LIKED_COMMENT(1065, "User not liked this comment", HttpStatus.BAD_REQUEST),
  FOLLOW_YOURSELF_ERROR(1066, "User cannot follow themselves", HttpStatus.BAD_REQUEST),
  FOLLOW_EXISTED_ERROR(1067, "User already followed", HttpStatus.BAD_REQUEST),
  FOLLOW_NOT_EXISTED_ERROR(1068, "User not followed", HttpStatus.BAD_REQUEST),
  UNFOLLOW_FAILED_ERROR(1069, "Unfollow failed", HttpStatus.BAD_REQUEST),
  FRIEND_REQUEST_ALREADY_EXISTS(1070, "Friend request already exists", HttpStatus.BAD_REQUEST),
  FRIEND_YOURSELF_ERROR(1071, "Requester and receiver cannot be the same", HttpStatus.BAD_REQUEST),
  FRIEND_NOT_EXISTED_ERROR(1072, "Friend request does not exist", HttpStatus.BAD_REQUEST),
  FILE_UPLOAD_FAILED(1073, "File upload failed", HttpStatus.BAD_REQUEST),
  FILE_NOT_EXISTED(1074, "File not existed", HttpStatus.BAD_REQUEST),
  INVALID_BUCKET_NAME_LENGTH(
      1075, "Bucket name must be between 3 and 63 characters", HttpStatus.BAD_REQUEST),
  INVALID_BUCKET_NAME_CHARACTER(
      1076,
      "Bucket name must contain only lowercase letters, numbers, periods, and hyphens",
      HttpStatus.BAD_REQUEST),
  INVALID_BUCKET_NAME_CONSECUTIVE_DOTS(
      1077, "Bucket name must not contain consecutive periods", HttpStatus.BAD_REQUEST),
  INVALID_BUCKET_NAME_IP_ADDRESS(
      1078, "Bucket name must not be formatted as an IP address", HttpStatus.BAD_REQUEST),
  CATEGORY_IS_EXISTED(1079, "Category is existed", HttpStatus.BAD_REQUEST),
  CATEGORY_NOT_FOUND(1080, "Category not found", HttpStatus.BAD_REQUEST),
  CATEGORY_IS_REQUIRED(1081, "Category is required", HttpStatus.BAD_REQUEST),
  PRODUCT_NOT_FOUND(1082, "Product not found", HttpStatus.BAD_REQUEST),
  PRODUCT_NOT_DELETED(1083, "Product not deleted", HttpStatus.BAD_REQUEST),
  ORDER_NOT_FOUND(1084, "Order not found", HttpStatus.BAD_REQUEST),
  LINE_ITEM_NOT_FOUND(1085, "Line item not found", HttpStatus.BAD_REQUEST),
  PRODUCT_IS_DELETED(1086, "Product is deleted", HttpStatus.BAD_REQUEST),
  PRODUCT_LIKED_EXISTED(1087, "Product liked existed", HttpStatus.BAD_REQUEST),
  PRODUCT_LIKED_NOT_EXISTED(1088, "Product liked not existed", HttpStatus.BAD_REQUEST),
  ADDRESS_NOT_BELONG_TO_USER(1089, "Address not belong to user", HttpStatus.BAD_REQUEST),
  ADDRESS_NOT_EXISTED(1090, "Address not existed", HttpStatus.BAD_REQUEST),
  MESSAGE_NOT_FOUND(1091, "Message not found", HttpStatus.BAD_REQUEST),
  CONVERSATION_NOT_FOUND(1092, "Conversation not found", HttpStatus.BAD_REQUEST),
  ORDER_CANNOT_BE_CANCELLED(1093, "Order cannot be cancelled", HttpStatus.BAD_REQUEST),
  ORDER_CANNOT_BE_REPAID(1094, "Order cannot be repaid", HttpStatus.BAD_REQUEST),
  PRODUCT_OUT_OF_STOCK(1095, "Product out of stock", HttpStatus.BAD_REQUEST),
  ;

  private final int code;
  private final HttpStatusCode statusCode;
  private final String message;

  ErrorCode(int code, String message, HttpStatusCode statusCode) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }
}
