package com.satvik.satchat.payload.user;

import com.satvik.satchat.entity.UserEntity;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendRequestDTO {
  private UUID id;
  private UserEntity requester;
}
