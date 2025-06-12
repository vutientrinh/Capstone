package com.satvik.satchat.mapper;

import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.payload.notification.NotificationResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationMapper {

  private final ModelMapper mapper = new ModelMapper();

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }

  public NotificationResponse toResponse(NotificationEntity entity) {
    try {
      return NotificationResponse.builder()
          .id(entity.getId())
          .content(entity.getContent())
          .messageType(entity.getMessageType())
          .isRead(entity.getIsRead())
          .createdAt(entity.getCreatedAt().toString())
          .updatedAt(entity.getUpdatedAt().toString())
          .actor(
              NotificationResponse.actor
                  .builder()
                  .id(entity.getActor().getId())
                  .username(entity.getActor().getUsername())
                  .firstName(entity.getActor().getFirstName())
                  .lastName(entity.getActor().getLastName())
                  .avatar(entity.getActor().getAvatar())
                  .build())
          .build();
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }
}
