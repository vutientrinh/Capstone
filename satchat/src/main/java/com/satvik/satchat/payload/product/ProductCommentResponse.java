package com.satvik.satchat.payload.product;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCommentResponse {
  private UUID id;
  private String author;
  private String comment;
  private Integer rating;
  private String createdAt;
  private String updatedAt;
}
