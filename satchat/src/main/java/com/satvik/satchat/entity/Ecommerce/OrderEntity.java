package com.satvik.satchat.entity.Ecommerce;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.OrderStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class OrderEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @Column(unique = true)
  private String orderCode; // orderCode from giaohangnhanh

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "customer", nullable = false)
  private UserEntity customer;

  @OneToMany(
      mappedBy = "order",
      fetch = FetchType.LAZY,
      cascade = CascadeType.ALL,
      orphanRemoval = true)
  private List<LineItemEntity> items;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private OrderStatus status = OrderStatus.PENDING;

  @Embedded private ShippingInfo shippingInfo;

  @OneToOne(mappedBy = "order", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  private PaymentEntity payment;

  @Builder.Default private BigDecimal totalAmount = BigDecimal.ZERO;

  @Builder.Default private BigDecimal shippingFee = BigDecimal.ZERO;
}
