package com.satvik.satchat.entity.Ecommerce;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_liked", schema = "public")
public class ProductLikedEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "author", nullable = false)
  private UserEntity author;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "product", nullable = false)
  private ProductEntity product;
}
