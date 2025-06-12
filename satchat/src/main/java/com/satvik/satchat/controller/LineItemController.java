package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.order.request.LineItemRequest;
import com.satvik.satchat.service.LineItemService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/line-items")
public class LineItemController {
  private final LineItemService lineItemService;

  public LineItemController(LineItemService lineItemService) {
    this.lineItemService = lineItemService;
  }

  @GetMapping("/{orderId}/items")
  public ResponseEntity<?> getLineItemsByOrderId(@PathVariable UUID orderId) {
    return ResponseEntity.ok(
        DataResponse.builder().data(lineItemService.getLineItemsByOrderId(orderId)).build());
  }

  @PostMapping("/{orderId}/items")
  public ResponseEntity<?> addLineItemToOrder(
      @PathVariable UUID orderId, @RequestBody List<LineItemRequest> items) {
    return ResponseEntity.ok(
        DataResponse.builder().data(lineItemService.addLineItemToOrder(orderId, items)).build());
  }

  @DeleteMapping("/{orderId}/items/{lineItemId}")
  public ResponseEntity<?> deleteLineItem(
      @PathVariable UUID orderId, @PathVariable UUID lineItemId) {
    return ResponseEntity.ok(
        DataResponse.builder()
            .data(lineItemService.removeLineItemFromOrder(orderId, lineItemId))
            .build());
  }
}
