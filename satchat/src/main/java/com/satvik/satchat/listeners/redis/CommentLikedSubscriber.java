package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.CommentEntity;
import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.NotificationMapper;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.payload.notification.NotificationCreateRequest;
import com.satvik.satchat.repository.*;
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
public class CommentLikedSubscriber implements MessageListener {
  private final CommentLikedRepository commentLikedRepository;
  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;

  public CommentLikedSubscriber(
      CommentLikedRepository commentLikedRepository,
      CommentRepository commentRepository,
      NotificationService notificationService,
      NotificationRepository notificationRepository,
      NotificationMapper notificationMapper,
      UserRepository userRepository,
      PostRepository postRepository,
      PostMapper postMapper,
      SimpMessagingTemplate messagingTemplate) {
    this.commentLikedRepository = commentLikedRepository;
    this.commentRepository = commentRepository;
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
    log.info("Comment liked: {}", message.toString());
    try {
      String content = message.toString();
      Map<String, Object> objMapper =
          StringUtils.convertStringToMap(content.substring(2, content.length() - 2));
      UUID commentId = UUID.fromString((String) objMapper.get("commentId"));
      UUID userLikedId = UUID.fromString((String) objMapper.get("userLikedId")); // Bob

      // Get comment entity
      UserEntity userLiked =
          userRepository
              .findById(userLikedId)
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
      CommentEntity comment =
          commentRepository
              .findById(commentId)
              .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

      // Get post entity from comment
      log.info("Comment liked: {}", commentId);
      UUID actorId = userLiked.getId();

      PostEntity post =
          postRepository
              .findById(comment.getPost().getId())
              .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
      UUID receiverId = comment.getAuthor().getId(); // Alice
      commentRepository.increaseLikeCount(commentId);

      // post_create socket
      Map<String, String> obj = new HashMap<>();
      obj.put("postId", String.valueOf(post.getId()));
      obj.put("commentId", commentId.toString());
      obj.put(
          "likedCount",
          String.valueOf(commentRepository.findById(commentId).get().getLikedCount()));
      obj.put("messageType", String.valueOf(MessageType.COMMENT_LIKED_COUNT));
      messagingTemplate.convertAndSend("/topic/notifications", obj);

      // publish post_liked to redis
      NotificationCreateRequest not =
          NotificationCreateRequest.builder()
              .actorId(actorId) // *user liked comment
              .receiverId(receiverId)
              .messageType(MessageType.COMMENT_LIKED)
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
