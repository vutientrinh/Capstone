package com.satvik.satchat.payload.category;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CategoryRequest {
  @NotBlank(message = "NOT_BLANK")
  private String name;

  private String description;
}
