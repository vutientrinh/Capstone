package com.satvik.satchat.payload.order.ghn;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryOrder {
  @JsonProperty("level1")
  private String level1;
}
