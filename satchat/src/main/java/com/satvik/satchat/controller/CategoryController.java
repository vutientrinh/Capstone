package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.category.CategoryRequest;
import com.satvik.satchat.service.CategoryService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/categories")
public class CategoryController {
  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
  public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest request) {
    return ResponseEntity.ok(
        DataResponse.builder().data(categoryService.createCategory(request)).build());
  }

  @PutMapping("/{id}/update")
  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
  public ResponseEntity<?> updateCategory(
      @PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
    return ResponseEntity.ok(
        DataResponse.builder().data(categoryService.updateCategory(id, request)).build());
  }

  @DeleteMapping("/{id}/delete")
  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
  public ResponseEntity<?> deleteCategory(@PathVariable UUID id) {
    return ResponseEntity.ok(
        DataResponse.builder().data(categoryService.deleteCategory(id)).build());
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getCategoryById(@PathVariable UUID id) {
    return ResponseEntity.ok(
        DataResponse.builder().data(categoryService.getCategoryById(id)).build());
  }

  @GetMapping("/all")
  public ResponseEntity<?> getAllCategories() {
    return ResponseEntity.ok(
        DataResponse.builder().data(categoryService.getAllCategories()).build());
  }
}
