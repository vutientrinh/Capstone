package com.satvik.satchat.payload.product;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
  UUID userId;
  String phone;
  String address;
  String wardCode;
  String wardName;
  int districtId;
  String districtName;
  int provinceId;
  String provinceName;
}
