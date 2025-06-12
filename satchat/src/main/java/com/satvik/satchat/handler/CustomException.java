package com.satvik.satchat.handler;

import com.satvik.satchat.common.ErrorCode;

public class CustomException extends RuntimeException {
  private final ErrorCode errorCode;
  private final Object[] args;

  public CustomException(ErrorCode errorCode, Object... args) {
    super(errorCode.getMessage());
    this.errorCode = errorCode;
    this.args = args;
  }

  public ErrorCode getErrorCode() {
    return errorCode;
  }

  public Object[] getArgs() {
    return args;
  }
}
