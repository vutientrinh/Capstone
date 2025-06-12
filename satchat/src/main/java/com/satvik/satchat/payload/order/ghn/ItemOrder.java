package com.satvik.satchat.payload.order.ghn;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrder {
  @JsonProperty("name")
  private String name;

  @JsonProperty("code")
  private String code;

  @JsonProperty("quantity")
  private int quantity;

  @JsonProperty("price")
  private int price;

  @JsonProperty("length")
  private int length;

  @JsonProperty("width")
  private int width;

  @JsonProperty("height")
  private int height;

  @JsonProperty("weight")
  private int weight;

  @JsonProperty("category")
  private CategoryOrder category;
}
