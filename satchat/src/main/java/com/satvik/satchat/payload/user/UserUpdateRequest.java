package com.satvik.satchat.payload.user;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

  private String avatar;
  private String cover;

  @NotBlank(message = "NOT_BLANK")
  private String firstName;

  @NotBlank(message = "NOT_BLANK")
  private String lastName;

  @NotBlank(message = "NOT_BLANK")
  private String bio;

  @NotBlank(message = "NOT_BLANK")
  private String websiteUrl;
}
