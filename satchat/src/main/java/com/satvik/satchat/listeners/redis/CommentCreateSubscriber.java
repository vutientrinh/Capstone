package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
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

@Service
@Slf4j
public class CommentCreateSubscriber implements MessageListener {

  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;

  public CommentCreateSubscriber(
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
      log.info("Comment created: {}", message);
      String content = message.toString();
      Map<String, Object> objMapper =
          StringUtils.convertStringToMap(content.substring(2, content.length() - 2));
      UUID postId = UUID.fromString((String) objMapper.get("postId"));
      UUID authorId = UUID.fromString((String) objMapper.get("authorId"));

      PostEntity postEntity =
          postRepository
              .findById(postId)
              .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

      userRepository
          .findById(authorId)
          .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      // post comment_count socket
      postRepository.increaseCommentCount(postId);

      // comment_count socket
      Map<String, String> obj = new HashMap<>();
      obj.put("postId", postId.toString());
      obj.put(
          "commentCount", String.valueOf(postRepository.findById(postId).get().getCommentCount()));
      obj.put("messageType", String.valueOf(MessageType.COMMENT_POST_COUNT));
      messagingTemplate.convertAndSend("/topic/notifications", obj);

      // Sent notification [COMMENT_POST] to post owner
      UUID receiverId = postEntity.getAuthor().getId();
      NotificationCreateRequest not =
          NotificationCreateRequest.builder()
              .actorId(authorId)
              .receiverId(receiverId)
              .messageType(MessageType.COMMENT_POST)
              .build();
      UUID notId = notificationService.create(not);

      // Notification socket
      NotificationEntity notificationEntity =
          notificationRepository
              .findById(notId)
              .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_EXISTED));
      messagingTemplate.convertAndSend(
          "/topic/notifications/" + receiverId, notificationMapper.toResponse(notificationEntity));
    } catch (AppException e) {
      log.error("Error: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Error: {}", e.getMessage());
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
  }
}
