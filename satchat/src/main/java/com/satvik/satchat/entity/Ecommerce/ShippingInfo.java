package com.satvik.satchat.entity.Ecommerce;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.satvik.satchat.model.Enum.ShippingStatus;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingInfo {
  private String ghnOrderCode;

  private String receiverName;
  private String receiverPhone;
  private String address;
  private String wardCode;
  private int districtId;
  private String serviceId;
  private String serviceTypeId;
  private String weight;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private ShippingStatus shippingStatus = ShippingStatus.PENDING;

  @JsonFormat(
      shape = JsonFormat.Shape.STRING,
      pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      timezone = "UTC")
  private Instant estimatedDeliveryDate;
}
