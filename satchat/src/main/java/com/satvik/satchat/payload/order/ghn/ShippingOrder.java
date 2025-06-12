package com.satvik.satchat.payload.order.ghn;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingOrder {
  @JsonProperty("shop_id")
  private int shopId;

  // Sender information
  @JsonProperty("from_name")
  private String fromName;

  @JsonProperty("from_phone")
  private String fromPhone;

  @JsonProperty("from_address")
  private String fromAddress;

  @JsonProperty("from_ward_name")
  private String fromWardName;

  @JsonProperty("from_district_name")
  private String fromDistrictName;

  @JsonProperty("from_provice_name")
  private String fromProvinceName;

  // Receiver information
  @JsonProperty("to_name")
  private String toName;

  @JsonProperty("to_phone")
  private String toPhone;

  @JsonProperty("to_address")
  private String toAddress;

  @JsonProperty("to_ward_code")
  private String toWardCode;

  @JsonProperty("to_district_id")
  private int toDistrictId;

  // Shipment details
  @JsonProperty("weight")
  private int weight;

  @JsonProperty("service_id")
  private int serviceId;

  @JsonProperty("service_type_id")
  private int serviceTypeId;

  @JsonProperty("payment_type_id")
  private int paymentTypeId;

  @JsonProperty("required_note")
  private String requiredNote;

  @JsonProperty("coupon")
  private String coupon; // Can be null

  @JsonProperty("items")
  private List<ItemOrder> items;
}
