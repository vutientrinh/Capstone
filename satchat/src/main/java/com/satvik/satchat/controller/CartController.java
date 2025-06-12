package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.order.request.LineItemRequest;
import com.satvik.satchat.payload.product.LineItemResponse;
import com.satvik.satchat.service.CartService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
  private final CartService cartService;

  public CartController(CartService cartService) {
    this.cartService = cartService;
  }

  @PostMapping("/{userId}/add")
  public ResponseEntity<?> addToCart(
      @PathVariable String userId, @RequestBody LineItemRequest item) {
    List<LineItemResponse> cart = cartService.addToCart(userId, item);
    return ResponseEntity.ok(DataResponse.builder().data(cart).build());
  }

  @GetMapping("/{userId}")
  public ResponseEntity<?> getCartItems(@PathVariable String userId) {
    List<LineItemResponse> cartItems = cartService.getCartItems(userId);
    return ResponseEntity.ok(DataResponse.builder().data(cartItems).build());
  }

  @DeleteMapping("/{userId}/clear")
  public ResponseEntity<?> clearCart(@PathVariable String userId) {
    cartService.clearCart(userId);
    return ResponseEntity.ok(DataResponse.builder().data(true).build());
  }
}
