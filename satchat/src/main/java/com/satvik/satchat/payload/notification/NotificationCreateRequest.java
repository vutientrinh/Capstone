package com.satvik.satchat.payload.notification;

import com.satvik.satchat.model.Enum.MessageType;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCreateRequest {
  UUID receiverId;
  UUID actorId;
  MessageType messageType;
}
