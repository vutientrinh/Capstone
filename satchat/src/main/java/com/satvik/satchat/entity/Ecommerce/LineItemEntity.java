package com.satvik.satchat.entity.Ecommerce;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.satvik.satchat.entity.Auditable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "line_items")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class LineItemEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "order_id", nullable = false)
  @JsonIgnore
  private OrderEntity order;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "product_id", nullable = false)
  private ProductEntity product;

  private Integer quantity;

  private BigDecimal price;

  private BigDecimal total;
}
