package com.satvik.satchat.mapper;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.Ecommerce.OrderEntity;
import com.satvik.satchat.entity.Ecommerce.ProductCommentEntity;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.model.Enum.OrderStatus;
import com.satvik.satchat.payload.product.ProductCommentResponse;
import com.satvik.satchat.payload.product.ProductResponse;
import com.satvik.satchat.repository.OrderRepository;
import com.satvik.satchat.repository.ProductCommentRepository;
import com.satvik.satchat.repository.ProductLikedRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProductMapper {
  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;
  private final ProductLikedRepository productLikedRepository;
  private final ProductCommentRepository productCommentRepository;
  private final OrderRepository orderRepository;
  private final ModelMapper modelMapper = new ModelMapper();

  public ProductMapper(
      JwtUtils jwtUtils,
      UserRepository userRepository,
      ProductLikedRepository productLikedRepository,
      ProductCommentRepository productCommentRepository,
      OrderRepository orderRepository) {
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
    this.productLikedRepository = productLikedRepository;
    this.productCommentRepository = productCommentRepository;
    this.orderRepository = orderRepository;
  }

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return modelMapper.map(entity, outClass);
    } catch (Exception e) {
      return null;
    }
  }

  public ProductResponse toResponse(ProductEntity product) {
    if (product == null) {
      return null;
    }

    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // isLiked ?
    Boolean isLiked = false;
    Optional<?> likedProduct = productLikedRepository.findByAuthorAndProduct(currentUser, product);
    if (likedProduct != null && likedProduct.isPresent()) {
      isLiked = true;
    }

    // salesCount
    int salesCount = 0;
    List<OrderEntity> orders = orderRepository.findAllOrdersByCustomerId(currentUser.getId());
    for (OrderEntity order : orders) {
      if (order.getStatus() == OrderStatus.DELIVERED) {
        salesCount +=
            order.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .mapToInt(item -> item.getQuantity())
                .sum();
      }
    }

    return ProductResponse.builder()
        .id(product.getId())
        .name(product.getName())
        .description(product.getDescription())
        .category(product.getCategory())
        .price(product.getPrice())
        .weight(product.getWeight())
        .width(product.getWidth())
        .height(product.getHeight())
        .length(product.getLength())
        .images(product.getImages().stream().map(file -> file.getFilename()).toList())
        .stockQuantity(product.getStockQuantity())
        .currency(product.getCurrency())
        .rating(product.getRating())
        .salesCount(salesCount)
        .visible(product.isVisible())
        .isDeleted(product.isDeleted())
        .isLiked(isLiked)
        .amountRating(productCommentRepository.findByProduct(product).size())
        .build();
  }

  public ProductCommentResponse toCommentResponse(ProductCommentEntity comment) {
    if (comment == null) {
      return null;
    }

    return ProductCommentResponse.builder()
        .id(comment.getId())
        .author(comment.getAuthor())
        .comment(comment.getComment())
        .rating(comment.getRating())
        .createdAt(comment.getCreatedAt().toString())
        .updatedAt(comment.getUpdatedAt().toString())
        .build();
  }
}
