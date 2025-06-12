package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.product.ProductCommentRequest;
import com.satvik.satchat.payload.product.ProductCommentResponse;
import com.satvik.satchat.service.ProductCommentService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductCommentController {
  private final ProductCommentService productCommentService;

  public ProductCommentController(ProductCommentService productCommentService) {
    this.productCommentService = productCommentService;
  }

  @PostMapping("/comment")
  public ResponseEntity<?> comment(@RequestBody ProductCommentRequest request) {
    ProductCommentResponse response = productCommentService.comment(request);
    if (response != null) {
      return ResponseEntity.ok(DataResponse.builder().data(response).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/comment/{productId}")
  public ResponseEntity<?> getComments(
      @PathVariable UUID productId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder()
            .data(productCommentService.getCommentsByProductId(productId, page, size))
            .build());
  }

  @DeleteMapping("/{commentId}/delete-comment")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> deleteComment(@PathVariable UUID commentId) {
    boolean deleted = productCommentService.deleteComment(commentId);
    if (deleted) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }
}
