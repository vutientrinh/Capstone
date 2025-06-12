package com.satvik.satchat.payload.order.request;

import java.math.BigDecimal;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingInfoRequest {
  private String receiverName;
  private String receiverPhone;
  private String address;
  private String wardCode;
  private int districtId;
  private BigDecimal shippingFee;
  private String serviceId;
  private String serviceTypeId;
  private String weight;
}
