package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.model.Enum.MessageType;
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

@Slf4j
@Service
public class UnFollowSubscriber implements MessageListener {

  private final SimpMessagingTemplate messagingTemplate;
  private final UserRepository userRepository;

  public UnFollowSubscriber(
      UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
    this.userRepository = userRepository;
    this.messagingTemplate = messagingTemplate;
  }

  @Override
  @Transactional
  public void onMessage(Message message, byte[] pattern) {
    try {
      log.info("[unfollow_count] Message received: {}", message);

      UUID followingId = UUID.fromString(message.toString().replaceAll("^\"|\"$", ""));
      userRepository
          .findById(followingId)
          .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      userRepository.decreasedFollowers(followingId);

      // un-follow socket
      Map<String, String> obj = new HashMap<>();
      obj.put("userId", followingId.toString());
      obj.put(
          "followerCount",
          String.valueOf(userRepository.findById(followingId).get().getFollowerCount()));
      obj.put("messageType", String.valueOf(MessageType.FOLLOW_COUNT));
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
