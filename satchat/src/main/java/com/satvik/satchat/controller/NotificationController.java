package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.dto.NotificationFilter;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.payload.notification.NotificationCreateRequest;
import com.satvik.satchat.service.NotificationService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin(origins = "*")
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public ResponseEntity<?> getNotifications(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @RequestParam(value = "messageType", required = false) MessageType messageType) {
    log.info("Getting notifications");
    NotificationFilter filter = new NotificationFilter(messageType);
    PageResponse<?> response = notificationService.getNotifications(page, size, filter);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/create")
  public ResponseEntity<?> createNotification(
      @Valid @RequestBody NotificationCreateRequest request) {
    UUID result = notificationService.create(request);
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/{id}/read")
  public ResponseEntity<?> readNotification(@Valid @PathVariable UUID id) {
    boolean result = notificationService.read(id);
    if (result) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/read-all")
  public ResponseEntity<?> readAllNotification() {
    boolean result = notificationService.readAll();
    if (result) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }
}
