package com.satvik.satchat.handler;

import com.satvik.satchat.common.ApiResponse;
import com.satvik.satchat.common.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  private static final String MIN_ATTRIBUTE = "min";
  private final MessageSource messageSource;

  public GlobalExceptionHandler(MessageSource messageSource) {
    this.messageSource = messageSource;
  }

  @ExceptionHandler(value = Exception.class)
  ResponseEntity<ApiResponse> handlingRuntimeException(
      RuntimeException exception, WebRequest request) {
    ServletRequestAttributes servletReq = (ServletRequestAttributes) request;
    HttpServletRequest req = servletReq.getRequest();
    String language = req.getHeader("Accept-Language");
    Locale locale = (language != null) ? Locale.forLanguageTag(language) : Locale.getDefault();

    log.error("Exception: ", exception);
    ApiResponse apiResponse = new ApiResponse();
    String localizedMessage =
        messageSource.getMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.name(), null, locale);

    apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
    apiResponse.setMessage(localizedMessage);

    return ResponseEntity.badRequest().body(apiResponse);
  }

  @ExceptionHandler(value = AppException.class)
  ResponseEntity<ApiResponse> handlingAppException(AppException exception, WebRequest request) {
    ServletRequestAttributes servletReq = (ServletRequestAttributes) request;
    HttpServletRequest req = servletReq.getRequest();
    String language = req.getHeader("Accept-Language");
    Locale locale = (language != null) ? Locale.forLanguageTag(language) : Locale.getDefault();

    // Get localized message
    ErrorCode errorCode = exception.getErrorCode();
    String localizedMessage = messageSource.getMessage(errorCode.name(), null, locale);
    ApiResponse apiResponse = new ApiResponse();

    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(localizedMessage);

    return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(value = CustomException.class)
  ResponseEntity<ApiResponse> handlingCustomException(
      CustomException exception, WebRequest request) {
    ServletRequestAttributes servletReq = (ServletRequestAttributes) request;
    HttpServletRequest req = servletReq.getRequest();
    String language = req.getHeader("Accept-Language");
    Locale locale = (language != null) ? Locale.forLanguageTag(language) : Locale.getDefault();

    // Get localized message
    ErrorCode errorCode = exception.getErrorCode();
    Object[] args = exception.getArgs();
    String localizedMessage = messageSource.getMessage(errorCode.name(), args, locale);
    ApiResponse apiResponse = new ApiResponse();

    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(localizedMessage);

    return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(value = AccessDeniedException.class)
  ResponseEntity<ApiResponse> handlingAccessDeniedException(
      AccessDeniedException exception, WebRequest request) {
    ServletRequestAttributes servletReq = (ServletRequestAttributes) request;
    HttpServletRequest req = servletReq.getRequest();
    String language = req.getHeader("Accept-Language");
    Locale locale = (language != null) ? Locale.forLanguageTag(language) : Locale.getDefault();

    ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
    String localizedMessage = messageSource.getMessage(errorCode.name(), null, locale);

    return ResponseEntity.status(errorCode.getStatusCode())
        .body(ApiResponse.builder().code(errorCode.getCode()).message(localizedMessage).build());
  }

  @ExceptionHandler(value = MethodArgumentNotValidException.class)
  ResponseEntity<ApiResponse> handlingValidation(
      MethodArgumentNotValidException exception, WebRequest request) {
    ServletRequestAttributes servletReq = (ServletRequestAttributes) request;
    HttpServletRequest req = servletReq.getRequest();
    String language = req.getHeader("Accept-Language");
    Locale locale = (language != null) ? Locale.forLanguageTag(language) : Locale.getDefault();
    String enumKey = exception.getFieldError().getDefaultMessage();

    ErrorCode errorCode = ErrorCode.INVALID_KEY;
    Map<String, Object> attributes = null;
    try {
      errorCode = ErrorCode.valueOf(enumKey);
      var constraintViolation =
          exception.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);
      attributes = constraintViolation.getConstraintDescriptor().getAttributes();

      log.info(attributes.toString());
    } catch (IllegalArgumentException e) {

    }

    ApiResponse apiResponse = new ApiResponse();
    String localizedMessage = messageSource.getMessage(errorCode.name(), null, locale);

    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(
        Objects.nonNull(attributes)
            ? mapAttribute(localizedMessage, attributes)
            : localizedMessage);

    return ResponseEntity.badRequest().body(apiResponse);
  }

  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFoundException(NoHandlerFoundException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", HttpStatus.NOT_FOUND.value());
    response.put("error", "Not Found");
    response.put("message", "The requested resource was not found on this server.");
    response.put("path", ex.getRequestURL());

    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }

  private String mapAttribute(String message, Map<String, Object> attributes) {
    String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

    return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
  }
}
