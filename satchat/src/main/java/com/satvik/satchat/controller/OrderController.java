package com.satvik.satchat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.dto.OrderFilter;
import com.satvik.satchat.model.Enum.OrderStatus;
import com.satvik.satchat.model.Enum.ShippingStatus;
import com.satvik.satchat.payload.order.request.CreateOrderRequest;
import com.satvik.satchat.service.GHNService;
import com.satvik.satchat.service.OrderService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/orders")
public class OrderController {
  private final OrderService orderService;
  private final GHNService ghnService;

  public OrderController(OrderService orderService, GHNService ghnService) {
    this.orderService = orderService;
    this.ghnService = ghnService;
  }

  @PostMapping("/create")
  public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest req)
      throws Exception {
    String response = orderService.createOrder(req);
    return ResponseEntity.ok(DataResponse.builder().data(response).build());
  }

  @GetMapping("/all")
  public ResponseEntity<?> getAllOrders(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @RequestParam(value = "status", required = false) OrderStatus status,
      @RequestParam(value = "customerId") UUID customerId) {
    OrderFilter orderFilter = OrderFilter.builder().status(status).customerId(customerId).build();
    return ResponseEntity.ok(orderService.getOrders(page, size, orderFilter));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOrderById(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(orderService.getOrderById(id));
  }

  @PostMapping("{orderId}/shipping-status")
  public ResponseEntity<?> updateOrderStatus(
      @PathVariable("orderId") UUID orderId, @RequestParam("status") String status) {
    ShippingStatus shippingStatus = ShippingStatus.valueOf(status.toUpperCase());
    return ResponseEntity.ok(orderService.updateShippingInfo(orderId, shippingStatus));
  }

  @DeleteMapping("/{id}/cancel-order")
  public ResponseEntity<?> cancelOrder(@PathVariable("id") UUID id) throws JsonProcessingException {
    return ResponseEntity.ok(orderService.cancelOrder(id));
  }

  @PostMapping("/repayment/{orderId}")
  public ResponseEntity<?> rePayment(@PathVariable UUID orderId) {
    String paymentUrl = orderService.rePayment(orderId);
    return ResponseEntity.ok(DataResponse.builder().data(paymentUrl).build());
  }

  @PostMapping("/print-label/{orderCode}")
  public ResponseEntity<?> printLabel(@PathVariable String orderCode)
      throws JsonProcessingException {
    return ResponseEntity.ok(ghnService.genCodeToPrint(orderCode));
  }
}
