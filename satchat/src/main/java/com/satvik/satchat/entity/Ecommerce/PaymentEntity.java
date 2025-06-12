package com.satvik.satchat.entity.Ecommerce;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.model.Enum.PaymentMethod;
import com.satvik.satchat.model.Enum.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "payment")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @OneToOne
  @JoinColumn(name = "order_id", nullable = false)
  @JsonIgnore
  private OrderEntity order;

  @Enumerated(EnumType.STRING)
  private PaymentMethod method;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private PaymentStatus status = PaymentStatus.PENDING;

  private String transactionId;

  private BigDecimal amountPaid;
}
