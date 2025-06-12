package com.satvik.satchat.payload.order.ghn;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstimateFee {

  @JsonProperty("shop_id")
  private int shopId;

  @JsonProperty("service_id")
  private int serviceId;

  @JsonProperty("service_type_id")
  private int serviceTypeId;

  @JsonProperty("to_ward_code")
  private String toWardCode;

  @JsonProperty("to_district_id")
  private int toDistrictId;

  @JsonProperty("weight")
  private int weight;
}
