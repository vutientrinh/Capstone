package com.satvik.satchat.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.satvik.satchat.payload.user.UserProfileResponse;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserConnection {
  private UUID connectionId;
  private String connectionUsername;
  private String convId;
  private int unSeen;
  private UserProfileResponse user;

  @JsonProperty("isOnline")
  private boolean isOnline;
}
