package com.example.springai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

  @Id
  @Column(name = "id", columnDefinition = "char(36)")
  private String id;

  @Column(name = "created_at")
  @JsonProperty("created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  @JsonProperty("updated_at")
  private LocalDateTime updatedAt;

  /** 0–11: currency types defined by your logic (e.g., 0 = USD, 1 = EUR, etc.) */
  @Column(nullable = false, columnDefinition = "SMALLINT")
  private Integer currency;

  private String description;

  private BigDecimal height;

  @Column(name = "is_deleted", nullable = false)
  @JsonProperty("is_deleted")
  private Boolean isDeleted;

  @Column(name = "is_liked", nullable = false)
  @JsonProperty("is_liked")
  private Boolean isLiked;

  private BigDecimal length;

  @Column(nullable = false)
  private String name;

  private BigDecimal price;

  @Column(nullable = false)
  private BigDecimal rating;

  @Column(name = "sales_count", nullable = false)
  @JsonProperty("sales_count")
  private Integer salesCount;

  @Column(name = "stock_quantity", nullable = false)
  @JsonProperty("stock_quantity")
  private Integer stockQuantity;

  @Column(nullable = false)
  private Boolean visible;

  @Column(nullable = false)
  private BigDecimal weight;

  private BigDecimal width;

  @Column(name = "category", columnDefinition = "char(36)")
  private String category;
}
