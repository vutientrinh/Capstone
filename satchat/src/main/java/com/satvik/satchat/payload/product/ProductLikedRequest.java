package com.satvik.satchat.payload.product;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductLikedRequest {
  private UUID productId;
}
