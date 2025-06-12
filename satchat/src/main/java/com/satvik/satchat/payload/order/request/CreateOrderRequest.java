package com.satvik.satchat.payload.order.request;

import java.util.List;
import java.util.UUID;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
  private UUID customerId;
  private List<LineItemRequest> items;
  private ShippingInfoRequest shippingInfo;
  private PaymentRequest payment;
}
