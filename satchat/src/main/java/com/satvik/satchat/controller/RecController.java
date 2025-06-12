package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.service.RecService;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rec")
@CrossOrigin(origins = "*")
@Slf4j
public class RecController {
  private final RecService recService;

  public RecController(RecService recService) {
    this.recService = recService;
  }

  @GetMapping("/rec-posts")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getRecPosts(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    try {
      return ResponseEntity.ok(
          DataResponse.builder().data(recService.getRecPosts(page, size)).build());
    } catch (Exception e) {
      log.error("Error getting recommended posts: {}", e.getMessage());
      return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
    }
  }

  @GetMapping("/rec-products")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getRecProducts(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    try {
      return ResponseEntity.ok().body(recService.getRecProducts(page, size));
    } catch (Exception e) {
      log.error("Error getting recommended products: {}", e.getMessage());
      return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
    }
  }

  @GetMapping("/{userId}/rec-posts")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getRecPostsByUserId(
      @PathVariable UUID userId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    try {
      return ResponseEntity.ok(
          DataResponse.builder().data(recService.getRecPostByUserId(userId, page, size)).build());
    } catch (Exception e) {
      log.error("Error getting recommended posts by userId: {}", e.getMessage());
      return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
    }
  }
}
