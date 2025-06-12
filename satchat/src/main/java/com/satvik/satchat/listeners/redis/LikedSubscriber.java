package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.NotificationMapper;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.payload.notification.NotificationCreateRequest;
import com.satvik.satchat.repository.NotificationRepository;
import com.satvik.satchat.repository.PostRepository;
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
public class LikedSubscriber implements MessageListener {
  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;

  public LikedSubscriber(
      NotificationService notificationService,
      NotificationRepository notificationRepository,
      NotificationMapper notificationMapper,
      UserRepository userRepository,
      PostRepository postRepository,
      PostMapper postMapper,
      SimpMessagingTemplate messagingTemplate) {
    this.notificationService = notificationService;
    this.notificationRepository = notificationRepository;
    this.notificationMapper = notificationMapper;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.postMapper = postMapper;
    this.messagingTemplate = messagingTemplate;
  }

  @Override
  @Transactional
  public void onMessage(Message message, byte[] pattern) {
    try {
      log.info("[like_count] Message received: {}", message);
      String content = message.toString();
      Map<String, Object> objMapper =
          StringUtils.convertStringToMap(content.substring(2, content.length() - 2));
      UUID postId = UUID.fromString((String) objMapper.get("postId"));
      UUID actorId = UUID.fromString((String) objMapper.get("authorId"));
      PostEntity postEntity =
          postRepository
              .findById(postId)
              .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

      // Receiver of notification
      UserEntity receiver =
          userRepository
              .findById(postEntity.getAuthor().getId())
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
      postRepository.increasedLikeCount(postId);

      // like_count socket
      Map<String, String> obj = new HashMap<>();
      obj.put("postId", postId.toString());
      obj.put("likedCount", String.valueOf(postRepository.findById(postId).get().getLikedCount()));
      obj.put("messageType", String.valueOf(MessageType.LIKE_COUNT));
      messagingTemplate.convertAndSend("/topic/notifications", obj);

      // Sent notification [LIKE_POST] to post owner
      NotificationCreateRequest not =
          NotificationCreateRequest.builder()
              .actorId(actorId)
              .receiverId(receiver.getId())
              .messageType(MessageType.LIKE_POST)
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
