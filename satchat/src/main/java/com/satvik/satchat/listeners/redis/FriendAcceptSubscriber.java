package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.NotificationMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.payload.notification.NotificationCreateRequest;
import com.satvik.satchat.repository.NotificationRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.service.NotificationService;
import com.satvik.satchat.utils.StringUtils;
import jakarta.transaction.Transactional;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FriendAcceptSubscriber implements MessageListener {
  private final SimpMessagingTemplate messagingTemplate;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;

  public FriendAcceptSubscriber(
      NotificationService notificationService,
      NotificationRepository notificationRepository,
      NotificationMapper notificationMapper,
      UserRepository userRepository,
      SimpMessagingTemplate messagingTemplate) {
    this.notificationService = notificationService;
    this.notificationRepository = notificationRepository;
    this.notificationMapper = notificationMapper;
    this.userRepository = userRepository;
    this.messagingTemplate = messagingTemplate;
  }

  @Override
  @Transactional
  public void onMessage(Message message, byte[] pattern) {
    log.info("Received message: {}", message.toString());
    try {
      String content = message.toString();
      Map<String, Object> objMapper =
          StringUtils.convertStringToMap(content.substring(2, content.length() - 2));
      UUID requesterId = UUID.fromString((String) objMapper.get("requesterId"));
      UUID receiverId = UUID.fromString((String) objMapper.get("receiverId"));

      // Get entities
      UserEntity requester =
          userRepository
              .findById(requesterId)
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
      UserEntity receiver =
          userRepository
              .findById(receiverId)
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      // count Friends and update
      userRepository.increaseFriendsCount(requesterId);
      userRepository.increaseFriendsCount(receiverId);

      // Notification socket
      NotificationCreateRequest not =
          NotificationCreateRequest.builder()
              .actorId(requester.getId())
              .receiverId(receiver.getId())
              .messageType(MessageType.FRIEND_REQUEST_ACCEPTED)
              .build();

      UUID notId = notificationService.create(not);

      // Notification socket
      NotificationEntity notificationEntity =
          notificationRepository
              .findById(notId)
              .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_EXISTED));
      messagingTemplate.convertAndSend(
          "/topic/notifications/" + receiver.getId(),
          notificationMapper.toResponse(notificationEntity));
    } catch (AppException e) {
      log.error("Error: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Error: {}", e.getMessage());
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
  }
}
