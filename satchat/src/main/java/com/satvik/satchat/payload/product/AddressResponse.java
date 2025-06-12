package com.satvik.satchat.payload.product;

import com.satvik.satchat.payload.user.UserProfileResponse;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
  UUID id;
  UserProfileResponse user;
  String phone;
  String address;
  String wardCode;
  String wardName;
  int districtId;
  String districtName;
  int provinceId;
  String provinceName;
  Boolean isDefault;
}
