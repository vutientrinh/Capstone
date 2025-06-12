package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.repository.PostRepository;
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
public class UnLikedSubscriber implements MessageListener {
  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final SimpMessagingTemplate messagingTemplate;

  public UnLikedSubscriber(
      PostRepository postRepository,
      PostMapper postMapper,
      SimpMessagingTemplate messagingTemplate) {
    this.postRepository = postRepository;
    this.postMapper = postMapper;
    this.messagingTemplate = messagingTemplate;
  }

  @Override
  public void onMessage(Message message, byte[] pattern) {
    try {
      log.info("[unlike_count] Message received: {}", message);

      UUID postId = UUID.fromString(message.toString().replaceAll("^\"|\"$", ""));
      postRepository
          .findById(postId)
          .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

      postRepository.decreasedLikeCount(postId);

      // post-updates socket
      Map<String, String> obj = new HashMap<>();
      obj.put("postId", postId.toString());
      obj.put("likedCount", String.valueOf(postRepository.findById(postId).get().getLikedCount()));
      obj.put("messageType", String.valueOf(MessageType.LIKE_COUNT));
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
