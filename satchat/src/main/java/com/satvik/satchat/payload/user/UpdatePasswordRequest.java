package com.satvik.satchat.payload.user;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequest {

  @NotBlank(message = "NOT_BLANK")
  private String currentPassword;

  @NotBlank(message = "NOT_BLANK")
  private String newPassword;
}
