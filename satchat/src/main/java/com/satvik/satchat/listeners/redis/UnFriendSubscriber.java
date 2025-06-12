package com.satvik.satchat.listeners.redis;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.repository.UserRepository;
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
public class UnFriendSubscriber implements MessageListener {
  private final SimpMessagingTemplate messagingTemplate;
  private final UserRepository userRepository;

  public UnFriendSubscriber(
      UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
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
      userRepository
          .findById(requesterId)
          .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
      userRepository
          .findById(receiverId)
          .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      // count Friends and update
      userRepository.descreaseFriendsCount(requesterId);
      userRepository.descreaseFriendsCount(receiverId);
    } catch (AppException e) {
      log.error("Error: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Error: {}", e.getMessage());
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
  }
}
