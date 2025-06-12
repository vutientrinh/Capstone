package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.product.ProductLikedRequest;
import com.satvik.satchat.service.ProductLikedService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductLikedController {
  private final ProductLikedService productLikedService;

  public ProductLikedController(ProductLikedService productLikedService) {
    this.productLikedService = productLikedService;
  }

  @PostMapping("/like")
  public ResponseEntity<?> like(@RequestBody ProductLikedRequest productLiked) {
    UUID result = productLikedService.like(productLiked.getProductId());
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/unlike")
  public ResponseEntity<?> unlike(@RequestBody ProductLikedRequest productLiked) {
    Boolean success = productLikedService.unlike(productLiked.getProductId());
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/liked")
  public ResponseEntity<?> getLikedProducts(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder().data(productLikedService.getLikedProducts(page, size)).build());
  }
}
