package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.Ecommerce.ProductCommentEntity;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.ProductMapper;
import com.satvik.satchat.payload.product.ProductCommentRequest;
import com.satvik.satchat.payload.product.ProductCommentResponse;
import com.satvik.satchat.repository.ProductCommentRepository;
import com.satvik.satchat.repository.ProductRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.utils.JwtUtils;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductCommentService {
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final ProductCommentRepository productCommentRepository;
  private final JwtUtils jwtUtils;
  private final ProductMapper productMapper;

  public ProductCommentService(
      UserRepository userRepository,
      ProductRepository productRepository,
      ProductCommentRepository productCommentRepository,
      JwtUtils jwtUtils,
      ProductMapper productMapper) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.productCommentRepository = productCommentRepository;
    this.jwtUtils = jwtUtils;
    this.productMapper = productMapper;
  }

  public ProductCommentResponse comment(ProductCommentRequest request) {
    ProductEntity product =
        productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    ProductCommentEntity comment =
        ProductCommentEntity.builder()
            .id(UUID.randomUUID())
            .author(request.getAuthor())
            .product(product)
            .comment(request.getComment())
            .rating(request.getRating())
            .build();
    productCommentRepository.save(comment);

    // check success
    if (productCommentRepository.existsById(comment.getId())) {
      // re-calculate the average rating
      Integer amountRating;
      BigDecimal avgRating = new BigDecimal(0);
      List<?> productComment = productCommentRepository.findByProduct(product);
      if (productComment != null && !productComment.isEmpty()) {
        amountRating = productComment.size();
        BigDecimal sumRating = new BigDecimal(0);
        for (Object c : productComment) {
          if (c instanceof ProductCommentEntity) {
            ProductCommentEntity productCommentEntity = (ProductCommentEntity) c;
            sumRating = sumRating.add(new BigDecimal(productCommentEntity.getRating()));
          }
        }
        if (amountRating > 0) {
          avgRating = sumRating.divide(new BigDecimal(amountRating), 1, BigDecimal.ROUND_HALF_UP);
        }
      }
      product.setRating(avgRating);
      productRepository.save(product);

      // return
      return productMapper.toCommentResponse(comment);
    }
    return null;
  }

  public PageResponse<ProductCommentResponse> getCommentsByProductId(
      UUID productId, int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    if (productId == null) {
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
    productRepository
        .findById(productId)
        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var comments = productCommentRepository.findAllByProduct(productId, pageable);
    return PageResponse.<ProductCommentResponse>builder()
        .currentPage(page)
        .pageSize(size)
        .totalElements(comments.getTotalElements())
        .totalPages(comments.getTotalPages())
        .data(comments.getContent().stream().map(productMapper::toCommentResponse).toList())
        .build();
  }

  public Boolean deleteComment(UUID commentId) {
    ProductCommentEntity comment =
        productCommentRepository
            .findById(commentId)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
    ProductEntity product = comment.getProduct();
    productCommentRepository.deleteById(commentId);

    // re-calculate the average rating
    List<ProductCommentEntity> productComments = productCommentRepository.findByProduct(product);
    if (productComments != null && !productComments.isEmpty()) {
      int amountRating = productComments.size();
      BigDecimal sumRating = BigDecimal.ZERO;

      for (ProductCommentEntity c : productComments) {
        sumRating = sumRating.add(BigDecimal.valueOf(c.getRating()));
      }

      BigDecimal avgRating =
          sumRating.divide(BigDecimal.valueOf(amountRating), 1, BigDecimal.ROUND_HALF_UP);
      product.setRating(avgRating);
    } else {
      product.setRating(BigDecimal.ZERO);
    }

    productRepository.save(product);
    return true;
  }
}
