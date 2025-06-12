package com.satvik.satchat.payload.product;

import com.satvik.satchat.entity.Ecommerce.CategoryEntity;
import com.satvik.satchat.model.Enum.Currency;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
  private UUID id;
  private String name;
  private String description;
  private CategoryEntity category;
  private BigDecimal price;
  private BigDecimal weight;
  private BigDecimal width;
  private BigDecimal height;
  private BigDecimal length;
  private List<String> images;
  private Integer stockQuantity;
  private Currency currency;
  private BigDecimal rating;
  private Integer salesCount;
  private Boolean visible;
  private Boolean isDeleted;
  private Boolean isLiked;
  private Integer amountRating;
}
