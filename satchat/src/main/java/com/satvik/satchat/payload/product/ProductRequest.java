package com.satvik.satchat.payload.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
  @NotBlank(message = "NOT_BLANK")
  private String name;

  @NotBlank(message = "CONTENT_LENGTH_INVALID")
  private String description;

  private BigDecimal price;
  private BigDecimal weight;
  private BigDecimal width;
  private BigDecimal height;
  private BigDecimal length;

  private List<MultipartFile> images;

  @NotNull(message = "CATEGORY_IS_REQUIRED")
  private UUID categoryId;

  private Integer stockQuantity;
}
