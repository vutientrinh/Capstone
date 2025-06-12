package com.satvik.satchat.payload.authentication;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SignupRequest {
  private String username;

  private String email;

  private Set<String> role;

  private String password;
}
