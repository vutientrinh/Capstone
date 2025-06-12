package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.dto.ProductFilter;
import com.satvik.satchat.payload.product.ProductRequest;
import com.satvik.satchat.payload.product.ProductResponse;
import com.satvik.satchat.service.ProductService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getProductById(@PathVariable UUID id) {
    return ResponseEntity.ok(
        DataResponse.builder().data(productService.getProductById(id)).build());
  }

  @PostMapping(value = "/create", consumes = "multipart/form-data")
  public ResponseEntity<?> createProduct(@ModelAttribute ProductRequest request) {
    ProductResponse result = productService.createProduct(request);
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping(value = "/{id}/update", consumes = "multipart/form-data")
  public ResponseEntity<?> updateProduct(
      @PathVariable UUID id, @ModelAttribute ProductRequest request) {
    ProductResponse result = productService.updateProduct(id, request);
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/all")
  public ResponseEntity<?> getAllProduct(
      @RequestParam(value = "page", defaultValue = "1") int page,
      @RequestParam(value = "size", defaultValue = "10") int size,
      @RequestParam(value = "search", required = false) String search,
      @RequestParam(value = "category", required = false) String category,
      @RequestParam(value = "minPrice", required = false) String minPrice,
      @RequestParam(value = "maxPrice", required = false) String maxPrice,
      @RequestParam(value = "rating", required = false, defaultValue = "0") int rating,
      @RequestParam(value = "inStock", required = false, defaultValue = "true") boolean inStock,
      @RequestParam(value = "field", required = false, defaultValue = "createdAt") String field,
      @RequestParam(value = "direction", required = false, defaultValue = "desc")
          String direction) {
    ProductFilter.FilterCriteria filterCriteria =
        ProductFilter.FilterCriteria.builder()
            .search(search)
            .category(category)
            .minPrice(minPrice)
            .maxPrice(maxPrice)
            .rating(rating)
            .inStock(inStock)
            .build();

    ProductFilter.SortCriteria sorting =
        ProductFilter.SortCriteria.builder().field(field).direction(direction).build();

    ProductFilter filter = ProductFilter.builder().filters(filterCriteria).sort(sorting).build();

    return ResponseEntity.ok(productService.getAllProduct(page, size, filter));
  }

  @DeleteMapping("/{id}/delete")
  public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
    Boolean result = productService.deleteProduct(id);
    return ResponseEntity.ok(DataResponse.builder().data(result).build());
  }

  @PostMapping("/{productId}/visible")
  public ResponseEntity<?> setVisibleProduct(
      @PathVariable UUID productId, @RequestParam boolean visible) {
    Boolean result = productService.setVisibleProduct(productId, visible);
    return ResponseEntity.ok(DataResponse.builder().data(result).build());
  }
}
