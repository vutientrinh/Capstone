package com.satvik.satchat.payload.refreshToken;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshRequest {
  @NotBlank(message = "NOT_BLANK")
  private String refreshToken;
}
