package com.satvik.satchat.entity.Ecommerce;

import com.satvik.satchat.entity.Auditable;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_comment", schema = "public")
public class ProductCommentEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "product", nullable = false)
  private ProductEntity product;

  @Column(name = "author", nullable = false)
  private String author;

  @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
  private String comment;

  @Column(name = "rating", nullable = false)
  @Builder.Default
  private Integer rating = 0;
}
