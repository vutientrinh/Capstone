package com.example.springai.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "product_keywords",
    uniqueConstraints = @UniqueConstraint(name = "unique_product_id", columnNames = "product_id"))
public class ProductKeyword {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "product_id", nullable = false, unique = true)
  private String productId;

  @Lob private String keyword;

  @Column(
      name = "updated_at",
      nullable = false,
      insertable = false,
      updatable = false,
      columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  @Builder.Default
  private Instant updatedAt = Instant.now();
}
