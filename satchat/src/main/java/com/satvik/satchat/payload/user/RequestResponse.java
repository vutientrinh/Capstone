package com.satvik.satchat.payload.user;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestResponse {

  private UUID id;
  private UUID requestId;
  private String username;
  private String firstName;
  private String lastName;
  private String avatar;
  private String createdAt;
}
