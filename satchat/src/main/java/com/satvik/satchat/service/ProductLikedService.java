package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.entity.Ecommerce.ProductLikedEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.ProductMapper;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.payload.product.ProductResponse;
import com.satvik.satchat.repository.ProductLikedRepository;
import com.satvik.satchat.repository.ProductRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProductLikedService {
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final ProductLikedRepository productLikedRepository;
  private final JwtUtils jwtUtils;
  private final UserMapper userMapper;
  private final ProductMapper productMapper;

  public ProductLikedService(
      UserRepository userRepository,
      ProductRepository productRepository,
      ProductLikedRepository productLikedRepository,
      JwtUtils jwtUtils,
      UserMapper userMapper,
      ProductMapper productMapper) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.productLikedRepository = productLikedRepository;
    this.jwtUtils = jwtUtils;
    this.userMapper = userMapper;
    this.productMapper = productMapper;
  }

  @Transactional
  @CacheEvict(
      value = {"product:list", "product:detail", "spring-app::rec-products"},
      allEntries = true)
  public UUID like(UUID productId) {
    UserEntity currentUser =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Post with id: {} liked", productId);
    ProductEntity product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    Optional<ProductLikedEntity> isExist =
        productLikedRepository.findByAuthorAndProduct(currentUser, product);
    if (isExist.isPresent()) {
      throw new AppException(ErrorCode.PRODUCT_LIKED_EXISTED);
    }

    ProductLikedEntity entity =
        ProductLikedEntity.builder()
            .id(UUID.randomUUID())
            .author(currentUser)
            .product(product)
            .build();
    productLikedRepository.save(entity);
    return entity.getId();
  }

  @Transactional
  @CacheEvict(
      value = {"product:list", "product:detail", "spring-app::rec-products"},
      allEntries = true)
  public Boolean unlike(UUID productId) {
    UserEntity currentUser =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Post with id: {} unliked", productId);
    ProductEntity product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    // check exist
    Optional<ProductLikedEntity> isExist =
        productLikedRepository.findByAuthorAndProduct(currentUser, product);
    if (isExist.isEmpty()) {
      throw new AppException(ErrorCode.PRODUCT_LIKED_NOT_EXISTED);
    }
    productLikedRepository.removeByAuthorAndProduct(currentUser, product);
    return true;
  }

  public PageResponse<ProductResponse> getLikedProducts(int page, int size) {
    UserEntity currentUser =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var likedProducts = productLikedRepository.findByAuthor(currentUser, pageable);

    return PageResponse.<ProductResponse>builder()
        .currentPage(page)
        .pageSize(likedProducts.getSize())
        .totalPages(likedProducts.getTotalPages())
        .totalElements(likedProducts.getTotalElements())
        .data(
            likedProducts.getContent().stream()
                .map(item -> productMapper.toResponse(item.getProduct()))
                .toList())
        .build();
  }
}
