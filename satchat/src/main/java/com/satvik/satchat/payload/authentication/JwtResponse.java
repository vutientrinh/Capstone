package com.satvik.satchat.payload.authentication;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
  private String token;

  @Builder.Default private String type = "Bearer";
  private String refreshToken;
  private UUID id;
  private String username;
  private List<String> roles;
}
