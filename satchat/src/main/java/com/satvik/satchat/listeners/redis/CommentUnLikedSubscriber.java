package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.CommentEntity;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.repository.CommentRepository;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.UserRepository;
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
public class CommentUnLikedSubscriber implements MessageListener {
  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final UserRepository userRepository;

  public CommentUnLikedSubscriber(
      CommentRepository commentRepository,
      PostRepository postRepository,
      UserRepository userRepository,
      PostMapper postMapper,
      SimpMessagingTemplate messagingTemplate) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.postMapper = postMapper;
    this.messagingTemplate = messagingTemplate;
  }

  @Override
  public void onMessage(Message message, byte[] pattern) {
    log.info("Comment unliked: {}", message.toString());
    String content = message.toString();
    UUID commentId = UUID.fromString(content.replaceAll("^\"|\"$", ""));

    // Get comment entity
    CommentEntity comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

    // Get post entity from comment
    log.info("Comment liked: {}", commentId);
    PostEntity post =
        postRepository
            .findById(comment.getPost().getId())
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
    commentRepository.decreaseLikeCount(commentId); // decrease like count

    // post_create socket
    Map<String, String> obj = new HashMap<>();
    obj.put("postId", String.valueOf(post.getId()));
    obj.put("commentId", commentId.toString());
    obj.put(
        "likedCount", String.valueOf(commentRepository.findById(commentId).get().getLikedCount()));
    obj.put("messageType", String.valueOf(MessageType.COMMENT_LIKED_COUNT));
    messagingTemplate.convertAndSend("/topic/notifications", obj);
  }
}
