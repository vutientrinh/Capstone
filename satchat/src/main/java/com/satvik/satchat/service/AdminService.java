package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.Ecommerce.CategoryEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.CommentMapper;
import com.satvik.satchat.mapper.ProductMapper;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.model.Enum.EStatus;
import com.satvik.satchat.model.Enum.OrderStatus;
import com.satvik.satchat.payload.admin.AnalysisResponse;
import com.satvik.satchat.payload.admin.TopCustomer;
import com.satvik.satchat.payload.admin.TopProduct;
import com.satvik.satchat.payload.comment.CommentResponse;
import com.satvik.satchat.payload.product.ProductCommentResponse;
import com.satvik.satchat.payload.product.ProductResponse;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.repository.*;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final CommentRepository commentRepository;
  private final ProductCommentRepository productCommentRepository;
  private final UserRepository userRepository;
  private final OrderRepository orderRepository;
  private final ProductMapper productMapper;
  private final CommentMapper commentMapper;
  private final UserMapper userMapper;

  public AdminService(
      ProductRepository productRepository,
      CategoryRepository categoryRepository,
      CommentRepository commentRepository,
      ProductCommentRepository productCommentRepository,
      UserRepository userRepository,
      OrderRepository orderRepository,
      ProductMapper productMapper,
      CommentMapper commentMapper,
      UserMapper userMapper) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.commentRepository = commentRepository;
    this.productCommentRepository = productCommentRepository;
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
    this.productMapper = productMapper;
    this.commentMapper = commentMapper;
    this.userMapper = userMapper;
  }

  public PageResponse<ProductResponse> getAdminProducts(int page, int size, String search) {
    if (page < 0 || size < 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var products =
        productRepository.getProductAdminPage(
            pageable, search != null && !search.isEmpty() ? search : "");

    return PageResponse.<ProductResponse>builder()
        .currentPage(page)
        .pageSize(products.getSize())
        .totalPages(products.getTotalPages())
        .totalElements(products.getTotalElements())
        .data(products.getContent().stream().map(productMapper::toResponse).toList())
        .build();
  }

  public PageResponse<CategoryEntity> getAdminCategories(int page, int size) {
    if (page < 0 || size < 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by(Sort.Order.desc("createdAt"), Sort.Order.asc("name"));
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var categories = categoryRepository.getCategories(pageable);

    return PageResponse.<CategoryEntity>builder()
        .currentPage(page)
        .pageSize(categories.getSize())
        .totalPages(categories.getTotalPages())
        .totalElements(categories.getTotalElements())
        .data(categories.getContent().stream().toList())
        .build();
  }

  public PageResponse<CommentResponse> getAdminPostComments(int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var comments = commentRepository.getAllComments(pageable);

    return PageResponse.<CommentResponse>builder()
        .currentPage(page)
        .pageSize(comments.getSize())
        .totalPages(comments.getTotalPages())
        .totalElements(comments.getTotalElements())
        .data(comments.stream().map(commentMapper::toCommentResponse).toList())
        .build();
  }

  public PageResponse<ProductCommentResponse> getAdminProductComments(
      int page, int size, String search) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    // Search is optional, if not provided, set it to an empty string
    if (search == null || search.isEmpty()) {
      search = "";
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var productComments = productCommentRepository.findProductComments(pageable, search);

    return PageResponse.<ProductCommentResponse>builder()
        .currentPage(page)
        .pageSize(productComments.getSize())
        .totalPages(productComments.getTotalPages())
        .totalElements(productComments.getTotalElements())
        .data(productComments.stream().map(productMapper::toCommentResponse).toList())
        .build();
  }

  public PageResponse<UserProfileResponse> getAllUsers(int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var users = userRepository.findAllUsersByAdmin(pageable);

    return PageResponse.<UserProfileResponse>builder()
        .currentPage(page)
        .pageSize(users.getSize())
        .totalPages(users.getTotalPages())
        .totalElements(users.getTotalElements())
        .data(
            users.getContent().stream()
                .map(item -> userMapper.map(item, UserProfileResponse.class))
                .toList())
        .build();
  }

  public Boolean setStatusAccount(UUID userId, EStatus status) {
    UserEntity user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    userRepository.updateUserStatus(user.getId(), status);
    userRepository
        .findById(user.getId())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED_AFTER_UPDATE));

    return true;
  }

  public AnalysisResponse getAnalysis() {
    var totalOrders = orderRepository.totalOrders();
    var sellingProducts = productRepository.sellingProducts();
    var totalProducts = productRepository.countProduct();
    var revenue = orderRepository.getTotalRevenue();
    var revenueGeneratingProducts = orderRepository.countProductByRevenue();
    var totalCustomers = orderRepository.countCustomers();
    var totalCompletedOrders = orderRepository.totalOrdersCompleted();

    // Order status
    var pending = orderRepository.countOrderByStatus(OrderStatus.PENDING);
    var shipped = orderRepository.countOrderByStatus(OrderStatus.SHIPPED);
    var delivered = orderRepository.countOrderByStatus(OrderStatus.DELIVERED);
    var failed = orderRepository.countOrderByStatus(OrderStatus.FAILED);
    var cancelled = orderRepository.countOrderByStatus(OrderStatus.CANCELLED);

    // Product status
    var selling = sellingProducts;
    var hidden = productRepository.countVisibleProduct();
    var outOfStock = productRepository.countOutOfStockProduct();
    var sold = orderRepository.countProductSold();

    return AnalysisResponse.builder()
        .totalOrders(totalOrders)
        .successRate(
            BigDecimal.valueOf(
                totalOrders == 0
                    ? 0
                    : Math.round((double) totalCompletedOrders / totalOrders * 1000) / 10.0))
        .sellingProducts(sellingProducts)
        .totalProducts(totalProducts)
        .revenue(revenue)
        .revenueGeneratingProducts(revenueGeneratingProducts)
        .totalCustomers(totalCustomers)
        .totalCompletedOrders(totalCompletedOrders)
        .orderStatus(
            AnalysisResponse.orderStatus
                .builder()
                .pending(pending)
                .shipped(shipped)
                .delivered(delivered)
                .failed(failed)
                .cancelled(cancelled)
                .build())
        .productStatus(
            AnalysisResponse.productStatus
                .builder()
                .selling(selling)
                .hidden(hidden)
                .outOfStock(outOfStock)
                .sold(sold)
                .build())
        .build();
  }

  public PageResponse<TopProduct> getTopProducts(int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Pageable pageable = PageRequest.of(page - 1, size);
    var orders = orderRepository.findTopProducts(pageable);

    return PageResponse.<TopProduct>builder()
        .currentPage(page)
        .pageSize(orders.getSize())
        .totalPages(orders.getTotalPages())
        .totalElements(orders.getTotalElements())
        .data(orders.getContent().stream().toList())
        .build();
  }

  public PageResponse<TopCustomer> getTopCustomers(int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Pageable pageable = PageRequest.of(page - 1, size);
    var orders = orderRepository.findTopCustomers(pageable);

    return PageResponse.<TopCustomer>builder()
        .currentPage(page)
        .pageSize(orders.getSize())
        .totalPages(orders.getTotalPages())
        .totalElements(orders.getTotalElements())
        .data(orders.getContent().stream().toList())
        .build();
  }
}
