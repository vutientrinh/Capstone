package com.satvik.satchat.dto;

import com.satvik.satchat.model.Enum.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationFilter {
  private MessageType messageType;
}
