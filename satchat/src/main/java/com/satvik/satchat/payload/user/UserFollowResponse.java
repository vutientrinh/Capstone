package com.satvik.satchat.payload.user;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFollowResponse {
  private UUID id;
  private String username;
  private String firstName;
  private String lastName;
  private String avatar;

  @Builder.Default private Boolean hasFollowedBack = false;
  private String followAt;
}
