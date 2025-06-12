package com.satvik.satchat.payload.order.request;

import com.satvik.satchat.model.Enum.PaymentMethod;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
  private PaymentMethod method;
  private int amountPaid;
}
