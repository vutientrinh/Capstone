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
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FollowSubscriber implements MessageListener {
  private final SimpMessagingTemplate messagingTemplate;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;

  public FollowSubscriber(
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
    try {
      log.info("[follow_count] Message received: {}", message);
      String content = message.toString();
      Map<String, Object> objMapper =
          StringUtils.convertStringToMap(content.substring(2, content.length() - 2));
      UUID followingId = UUID.fromString((String) objMapper.get("followingId"));
      UUID followerId = UUID.fromString((String) objMapper.get("followerId"));

      // Entities
      UserEntity following =
          userRepository
              .findById(followingId)
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
      UserEntity follower =
          userRepository
              .findById(followerId)
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      // Increase followers
      userRepository.increaseFollowers(followingId);

      // follow_count socket
      Map<String, String> obj = new HashMap<>();
      obj.put("userId", followingId.toString());
      obj.put(
          "followerCount",
          String.valueOf(userRepository.findById(followingId).get().getFollowerCount()));
      obj.put("messageType", String.valueOf(MessageType.FOLLOW_COUNT));
      messagingTemplate.convertAndSend("/topic/notifications", obj);

      log.info("User {} followed user {}", follower.getUsername(), following.getUsername());
      // Receiver of notification
      NotificationCreateRequest notification =
          NotificationCreateRequest.builder()
              .actorId(follower.getId())
              .receiverId(following.getId())
              .messageType(MessageType.FOLLOW_USER)
              .build();

      UUID notId = notificationService.create(notification);

      // Notification socket
      NotificationEntity notificationEntity =
          notificationRepository
              .findById(notId)
              .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_EXISTED));
      messagingTemplate.convertAndSend(
          "/topic/notifications/" + following.getId(),
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
