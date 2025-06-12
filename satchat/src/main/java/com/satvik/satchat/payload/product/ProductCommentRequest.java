package com.satvik.satchat.payload.product;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCommentRequest {
  private UUID productId;
  private String author;
  private String comment;
  private Integer rating;
}
