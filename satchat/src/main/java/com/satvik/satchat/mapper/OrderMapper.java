package com.satvik.satchat.mapper;

import com.satvik.satchat.entity.Ecommerce.LineItemEntity;
import com.satvik.satchat.payload.order.response.ItemsResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class OrderMapper {
  private final ModelMapper mapper = new ModelMapper();
  private final ProductMapper productMapper;

  public OrderMapper(ProductMapper productMapper) {
    this.productMapper = productMapper;
  }

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }

  public ItemsResponse toItemsResponse(LineItemEntity entity) {
    return ItemsResponse.builder()
        .id(entity.getId())
        .product(productMapper.toResponse(entity.getProduct()))
        .quantity(entity.getQuantity())
        .price(entity.getPrice())
        .total(entity.getTotal())
        .createdAt(entity.getCreatedAt().toString())
        .updatedAt(entity.getUpdatedAt().toString())
        .build();
  }
}
