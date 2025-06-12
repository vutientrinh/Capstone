package com.satvik.satchat.mapper;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.payload.order.request.LineItemRequest;
import com.satvik.satchat.payload.product.LineItemResponse;
import com.satvik.satchat.repository.ProductRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CartMapper {
  private final ModelMapper mapper = new ModelMapper();
  private final ProductMapper productMapper;
  private final ProductRepository productRepository;

  public CartMapper(ProductMapper productMapper, ProductRepository productRepository) {
    this.productMapper = productMapper;
    this.productRepository = productRepository;
  }

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }

  public List<LineItemResponse> toCart(List<LineItemRequest> request) {
    List<LineItemResponse> lstResponse = new ArrayList<>();
    request.stream().map(item -> toCartResponse((item))).forEach(lstResponse::add);
    return lstResponse;
  }

  public LineItemResponse toCartResponse(LineItemRequest request) {
    LineItemResponse cartResponse = new LineItemResponse();
    ProductEntity product =
        productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    // mapping
    cartResponse.setProduct(productMapper.toResponse(product));
    cartResponse.setPrice(request.getPrice());
    cartResponse.setQuantity(request.getQuantity());
    return cartResponse;
  }
}
