package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.UserRepository;
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
public class PostDeleteSubscriber implements MessageListener {
  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;

  public PostDeleteSubscriber(
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
  @Transactional
  public void onMessage(Message message, byte[] pattern) {
    try {
      log.info("[post_delete] Message received: {}", message);
      String content = message.toString();
      UUID authorId = UUID.fromString(message.toString().replaceAll("^\"|\"$", ""));
      userRepository
          .findById(authorId)
          .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      // decrease post count
      userRepository.decrementPostCount(authorId);

      // post-delete socket
      Map<String, String> obj = new HashMap<>();
      obj.put("authorId", authorId.toString());
      obj.put("postCount", String.valueOf(userRepository.findById(authorId).get().getPostCount()));
      obj.put("messageType", String.valueOf(MessageType.POST_COUNT));
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
