package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.NumberDeserializers;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Product implements Serializable {
  private UUID id;

  @JsonProperty("created_at")
  private String createdAt;

  @JsonProperty("updated_at")
  private String updatedAt;

  private int currency;
  private String description;

  @JsonDeserialize(using = NumberDeserializers.BigDecimalDeserializer.class)
  private BigDecimal height;

  @JsonProperty("is_deleted")
  private boolean isDeleted;

  @JsonProperty("is_liked")
  private boolean isLiked;

  @JsonDeserialize(using = NumberDeserializers.BigDecimalDeserializer.class)
  private BigDecimal length;

  private String name;

  @JsonDeserialize(using = NumberDeserializers.BigDecimalDeserializer.class)
  private BigDecimal price;

  @JsonDeserialize(using = NumberDeserializers.BigDecimalDeserializer.class)
  private BigDecimal rating;

  @JsonProperty("sales_count")
  private int salesCount;

  @JsonProperty("stock_quantity")
  private int stockQuantity;

  private boolean visible;

  @JsonDeserialize(using = NumberDeserializers.BigDecimalDeserializer.class)
  private BigDecimal weight;

  @JsonDeserialize(using = NumberDeserializers.BigDecimalDeserializer.class)
  private BigDecimal width;

  private UUID category;

  public String toJson() {
    return String.format(
        "{\"id\":\"%s\",\"created_at\":\"%s\",\"updated_at\":\"%s\",\"currency\":%d,\"description\":\"%s\",\"height\":%s,\"is_deleted\":%b,\"is_liked\":%b,\"length\":%s,\"name\":\"%s\",\"price\":%s,\"rating\":%s,\"sales_count\":%d,\"stock_quantity\":%d,\"visible\":%b,\"weight\":%s,\"width\":%s,\"category\":\"%s\"}",
        id,
        createdAt,
        updatedAt,
        currency,
        description,
        height,
        isDeleted,
        isLiked,
        length,
        name,
        price,
        rating,
        salesCount,
        stockQuantity,
        visible,
        weight,
        width,
        category);
  }
}
