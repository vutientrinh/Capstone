package com.satvik.satchat.payload.order.response;

import com.satvik.satchat.entity.Ecommerce.PaymentEntity;
import com.satvik.satchat.entity.Ecommerce.ShippingInfo;
import com.satvik.satchat.model.Enum.OrderStatus;
import com.satvik.satchat.payload.user.UserProfileResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
  private UUID id;
  private String orderCode;
  private OrderStatus status;
  private BigDecimal totalAmount;
  private BigDecimal shippingFee;
  private UserProfileResponse customer;
  private List<ItemsResponse> items;
  private ShippingInfo shippingInfo;
  private PaymentEntity payment;
  private String createdAt;
  private String updatedAt;
}
