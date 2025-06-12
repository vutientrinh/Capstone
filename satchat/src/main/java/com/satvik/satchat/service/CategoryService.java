package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.Ecommerce.CategoryEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.payload.category.CategoryRequest;
import com.satvik.satchat.repository.CategoryRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
  private final CategoryRepository categoryRepository;

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public CategoryEntity createCategory(CategoryRequest category) {
    boolean isExist = categoryRepository.existsByName(category.getName());
    if (isExist) throw new AppException(ErrorCode.CATEGORY_IS_EXISTED);
    CategoryEntity categoryEntity =
        CategoryEntity.builder()
            .id(UUID.randomUUID())
            .name(category.getName())
            .description(category.getDescription())
            .build();
    return categoryRepository.save(categoryEntity);
  }

  public CategoryEntity updateCategory(UUID id, CategoryRequest category) {
    CategoryEntity categoryEntity =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    categoryEntity.setName(category.getName());
    categoryEntity.setDescription(category.getDescription());
    return categoryRepository.save(categoryEntity);
  }

  public UUID deleteCategory(UUID id) {
    CategoryEntity categoryEntity =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    categoryRepository.deleteCategory(categoryEntity);
    return categoryEntity.getId();
  }

  public CategoryEntity getCategoryById(UUID id) {
    return categoryRepository
        .findById(id)
        .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
  }

  public List<CategoryEntity> getAllCategories() {
    return categoryRepository.findAll();
  }
}
