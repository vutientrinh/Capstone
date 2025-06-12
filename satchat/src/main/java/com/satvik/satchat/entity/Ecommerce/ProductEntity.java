package com.satvik.satchat.entity.Ecommerce;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import com.satvik.satchat.model.Enum.Currency;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "products", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ProductEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @Column(nullable = false)
  private String name;

  private String description;

  @ManyToOne
  @JoinColumn(name = "category")
  private CategoryEntity category;

  private BigDecimal price;

  @Column(nullable = false)
  private BigDecimal weight;

  private BigDecimal width;
  private BigDecimal height;
  private BigDecimal length;

  @Column(name = "images")
  @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  private List<FileEntity> images;

  @Column(nullable = false)
  @Builder.Default
  private Integer stockQuantity = 0;

  @Column(nullable = false, length = 3)
  @Builder.Default
  private Currency currency = Currency.VND;

  @Column(nullable = false)
  @Builder.Default
  private BigDecimal rating = new BigDecimal(0);

  @Column(nullable = false)
  @Builder.Default
  private Integer salesCount = 0;

  @Column(nullable = false)
  @Builder.Default
  private boolean visible = true;

  @Column(nullable = false)
  @Builder.Default
  private boolean isDeleted = false;

  @Column(nullable = false)
  @Builder.Default
  private boolean isLiked = false;
}
