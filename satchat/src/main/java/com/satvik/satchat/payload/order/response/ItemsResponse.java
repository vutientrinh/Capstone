package com.satvik.satchat.payload.order.response;

import com.satvik.satchat.payload.product.ProductResponse;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemsResponse {
  UUID id;
  ProductResponse product;
  Integer quantity;
  BigDecimal price;
  BigDecimal total;
  String createdAt;
  String updatedAt;
}
