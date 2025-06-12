package com.satvik.satchat.payload.product;

import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineItemResponse {
  private ProductResponse product;
  private BigDecimal price;
  private Integer quantity;
}
