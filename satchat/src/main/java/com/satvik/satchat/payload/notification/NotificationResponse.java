package com.satvik.satchat.payload.notification;

import com.satvik.satchat.model.Enum.MessageType;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

  private UUID id;
  private String content;
  private MessageType messageType;
  private actor actor;
  private Boolean isRead;
  private String createdAt;
  private String updatedAt;

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class actor {
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String avatar;
  }
}
