package com.satvik.satchat.payload.order.request;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LineItemRequest {
  private UUID productId;
  private BigDecimal price;
  private Integer quantity;
}
