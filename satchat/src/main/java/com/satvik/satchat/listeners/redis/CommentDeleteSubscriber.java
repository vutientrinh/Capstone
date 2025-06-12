package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.utils.StringUtils;
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
public class CommentDeleteSubscriber implements MessageListener {

  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final UserRepository userRepository;

  public CommentDeleteSubscriber(
      PostRepository postRepository,
      UserRepository userRepository,
      PostMapper postMapper,
      SimpMessagingTemplate messagingTemplate) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.postMapper = postMapper;
    this.messagingTemplate = messagingTemplate;
  }

  @Override
  public void onMessage(Message message, byte[] pattern) {
    log.info("Comment deleted: {}", message.toString());
    try {
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
      postRepository.decreaseCommentCount(postId);

      // like_count socket
      Map<String, String> obj = new HashMap<>();
      obj.put("postId", postId.toString());
      obj.put(
          "commentCount", String.valueOf(postRepository.findById(postId).get().getCommentCount()));
      obj.put("messageType", String.valueOf(MessageType.COMMENT_POST_COUNT));
      messagingTemplate.convertAndSend("/topic/notifications", obj);
    } catch (AppException e) {
      log.error("Error: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Error: {}", e.getMessage());
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
  }
}
