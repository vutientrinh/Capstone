package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.dto.OrderFilter;
import com.satvik.satchat.model.Enum.EStatus;
import com.satvik.satchat.model.Enum.OrderStatus;
import com.satvik.satchat.service.AdminService;
import com.satvik.satchat.service.OrderService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class AdminController {
  private final AdminService adminService;
  private final OrderService orderService;

  public AdminController(AdminService adminService, OrderService orderService) {
    this.adminService = adminService;
    this.orderService = orderService;
  }

  @GetMapping("/get-products")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getAllProduct(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "size", defaultValue = "10") int size,
      @RequestParam(value = "search", required = false) String search) {
    return ResponseEntity.ok(adminService.getAdminProducts(page, size, search));
  }

  @GetMapping("/get-categories")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getAllCategories(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "size", defaultValue = "10") int size) {
    return ResponseEntity.ok(adminService.getAdminCategories(page, size));
  }

  @GetMapping("/get-post-comments")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getAllPostComments(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "size", defaultValue = "10") int size) {
    return ResponseEntity.ok(adminService.getAdminPostComments(page, size));
  }

  @GetMapping("/get-product-comments")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getAllProductComments(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "size", defaultValue = "10") int size,
      @RequestParam(value = "search", required = false) String search) {
    return ResponseEntity.ok(adminService.getAdminProductComments(page, size, search));
  }

  @GetMapping("/get-users")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getSuggestedUsers(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "5") int size) {
    return ResponseEntity.ok(adminService.getAllUsers(page, size));
  }

  @PostMapping("/{userId}/change-status")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> changeUserStatus(
      @PathVariable UUID userId, @RequestParam String status) {
    EStatus userStatus = EStatus.valueOf(status.toUpperCase());
    return ResponseEntity.ok(adminService.setStatusAccount(userId, userStatus));
  }

  @GetMapping("/get-orders")
  public ResponseEntity<?> getAllOrders(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @RequestParam(value = "status", required = false) OrderStatus status,
      @RequestParam(value = "search", required = false) String search) {
    OrderFilter orderFilter = OrderFilter.builder().status(status).search(search).build();
    return ResponseEntity.ok(orderService.getOrders(page, size, orderFilter));
  }

  @GetMapping("/analysis")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getAnalysis() {
    return ResponseEntity.ok(DataResponse.builder().data(adminService.getAnalysis()).build());
  }

  @GetMapping("/top-products")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getTopProducts(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(adminService.getTopProducts(page, size));
  }

  @GetMapping("/top-customers")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getTopCustomers(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(adminService.getTopCustomers(page, size));
  }
}
