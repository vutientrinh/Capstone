package com.satvik.satchat.payload.user;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendRequest {
  private UUID receiverId;
  private UUID requesterId;
}
