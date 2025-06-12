package com.satvik.satchat.utils;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import org.springframework.stereotype.Component;

@Component
public class S3BucketValidator {

  public static boolean isValidBucketName(String bucketName) {
    // Check length
    if (bucketName.length() < 3 || bucketName.length() > 63) {
      throw new AppException(ErrorCode.INVALID_BUCKET_NAME_LENGTH);
    }
    // Check for allowed characters
    if (!bucketName.matches("^[a-z0-9][a-z0-9.-]*[a-z0-9]$")) {
      throw new AppException(ErrorCode.INVALID_BUCKET_NAME_CHARACTER);
    }
    // Check for consecutive dots
    if (bucketName.contains("..")) {
      throw new AppException(ErrorCode.INVALID_BUCKET_NAME_CONSECUTIVE_DOTS);
    }
    // Check if formatted as an IP address
    if (bucketName.matches("^(\\d+\\.){3}\\d+$")) {
      throw new AppException(ErrorCode.INVALID_BUCKET_NAME_IP_ADDRESS);
    }
    return true;
  }
}
