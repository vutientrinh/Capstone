package com.satvik.satchat.service;

import static com.satvik.satchat.utils.DbUtils.getConvId;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.ConversationEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.ChatMessageMapper;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.model.ChatMessage;
import com.satvik.satchat.model.Enum.MessageDeliveryStatusEnum;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.model.UnseenMessageCountResponse;
import com.satvik.satchat.model.UserConnection;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.repository.ConversationRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.SecurityUtils;
import java.sql.Timestamp;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@Slf4j
public class ConversationService {
  private final UserRepository userRepository;
  private final SecurityUtils securityUtils;
  private final ChatMessageMapper chatMessageMapper;
  private final ConversationRepository conversationRepository;
  private final OnlineOfflineService onlineOfflineService;
  private final SimpMessageSendingOperations simpMessageSendingOperations;
  private final UserMapper userMapper;

  public ConversationService(
      UserRepository userRepository,
      SecurityUtils securityUtils,
      ChatMessageMapper chatMessageMapper,
      ConversationRepository conversationRepository,
      OnlineOfflineService onlineOfflineService,
      SimpMessageSendingOperations simpMessageSendingOperations,
      UserMapper userMapper) {
    this.userRepository = userRepository;
    this.securityUtils = securityUtils;
    this.chatMessageMapper = chatMessageMapper;
    this.conversationRepository = conversationRepository;
    this.onlineOfflineService = onlineOfflineService;
    this.simpMessageSendingOperations = simpMessageSendingOperations;
    this.userMapper = userMapper;
  }

  public List<UserConnection> getUserFriends() {
    UserDetailsImpl userDetails = securityUtils.getUser();
    String username = userDetails.getUsername();
    List<UserEntity> users = userRepository.findAll();
    UserEntity thisUser =
        users.stream()
            .filter(user -> user.getUsername().equals(username))
            .findFirst()
            .orElseThrow(() -> new AppException(ErrorCode.ENTITY_IS_NOT_FOUND_IN_DATABASE));

    return users.stream()
        .filter(user -> !user.getUsername().equals(username))
        .map(
            user ->
                UserConnection.builder()
                    .connectionId(user.getId())
                    .connectionUsername(user.getUsername())
                    .convId(getConvId(user, thisUser))
                    .unSeen(0)
                    .user(userMapper.map(user, UserProfileResponse.class))
                    .isOnline(onlineOfflineService.isUserOnline(user.getId()))
                    .build())
        .toList();
  }

  public List<UnseenMessageCountResponse> getUnseenMessageCount() {
    List<UnseenMessageCountResponse> result = new ArrayList<>();
    UserDetailsImpl userDetails = securityUtils.getUser();
    List<ConversationEntity> unseenMessages =
        conversationRepository.findUnseenMessagesCount(userDetails.getId());

    if (!CollectionUtils.isEmpty(unseenMessages)) {
      Map<UUID, List<ConversationEntity>> unseenMessageCountByUser = new HashMap<>();
      for (ConversationEntity entity : unseenMessages) {
        List<ConversationEntity> values =
            unseenMessageCountByUser.getOrDefault(entity.getFromUser(), new ArrayList<>());
        values.add(entity);
        unseenMessageCountByUser.put(entity.getFromUser(), values);
      }
      log.info("there are some unseen messages for {}", userDetails.getUsername());
      unseenMessageCountByUser.forEach(
          (user, entities) -> {
            result.add(
                UnseenMessageCountResponse.builder()
                    .count((long) entities.size())
                    .fromUser(user)
                    .build());
            updateMessageDelivery(user, entities, MessageDeliveryStatusEnum.DELIVERED);
          });
    }
    return result;
  }

  public List<ChatMessage> getUnseenMessages(UUID fromUserId) {
    List<ChatMessage> result = new ArrayList<>();
    UserDetailsImpl userDetails = securityUtils.getUser();
    List<ConversationEntity> unseenMessages =
        conversationRepository.findUnseenMessages(userDetails.getId(), fromUserId);

    if (!CollectionUtils.isEmpty(unseenMessages)) {
      log.info(
          "there are some unseen messages for {} from {}", userDetails.getUsername(), fromUserId);
      updateMessageDelivery(fromUserId, unseenMessages, MessageDeliveryStatusEnum.SEEN);
      result = chatMessageMapper.toChatMessages(unseenMessages, userDetails, MessageType.UNSEEN);
    }
    return result;
  }

  private void updateMessageDelivery(
      UUID user,
      List<ConversationEntity> entities,
      MessageDeliveryStatusEnum messageDeliveryStatusEnum) {
    entities.forEach(e -> e.setDeliveryStatus(messageDeliveryStatusEnum.toString()));
    onlineOfflineService.notifySender(user, entities, messageDeliveryStatusEnum);
    conversationRepository.saveAll(entities);
  }

  public List<ChatMessage> setReadMessages(List<ChatMessage> chatMessages) {
    List<UUID> inTransitMessageIds = chatMessages.stream().map(ChatMessage::getId).toList();
    List<ConversationEntity> conversationEntities =
        conversationRepository.findAllById(inTransitMessageIds);
    conversationEntities.forEach(
        message -> message.setDeliveryStatus(MessageDeliveryStatusEnum.SEEN.toString()));
    List<ConversationEntity> saved = conversationRepository.saveAll(conversationEntities);

    return chatMessageMapper.toChatMessages(saved, securityUtils.getUser(), MessageType.CHAT);
  }

  public PageResponse<ChatMessage> getMessagesBefore(
      UUID messageId, String convId, int page, int size) {

    UserDetailsImpl userDetails = securityUtils.getUser();
    log.info("User details: {}", userDetails);

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    UUID currentUserId = userDetails.getId();
    UUID otherUserId = null;
    Timestamp beforeTime = null;
    Page<ConversationEntity> messagesPage;

    if (messageId != null) {
      ConversationEntity currentMessage =
          conversationRepository
              .findById(messageId)
              .orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

      otherUserId =
          currentMessage.getFromUser().equals(currentUserId)
              ? currentMessage.getToUser()
              : currentMessage.getFromUser();

      beforeTime = currentMessage.getTime();
    } else if (convId != null && !convId.isEmpty()) {
      List<ConversationEntity> conversations = conversationRepository.findByConvId(convId);

      if (conversations.isEmpty()) {
        return PageResponse.<ChatMessage>builder()
            .currentPage(page)
            .pageSize(size)
            .totalPages(0)
            .totalElements(0)
            .data(Collections.emptyList())
            .build();
      }

      ConversationEntity lastConversation = conversations.get(0);
      otherUserId =
          lastConversation.getFromUser().equals(currentUserId)
              ? lastConversation.getToUser()
              : lastConversation.getFromUser();

      beforeTime = new Timestamp(System.currentTimeMillis());
    } else {
      return PageResponse.<ChatMessage>builder()
          .currentPage(page)
          .pageSize(size)
          .totalPages(0)
          .totalElements(0)
          .data(Collections.emptyList())
          .build();
    }

    Sort sort = Sort.by("time").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);

    if (messageId != null) {
      messagesPage =
          conversationRepository.getMessagesBefore(currentUserId, otherUserId, messageId, pageable);
    } else {
      messagesPage =
          conversationRepository.getMessagesByConvIdBefore(
              currentUserId, otherUserId, convId, beforeTime, pageable);
    }

    return PageResponse.<ChatMessage>builder()
        .currentPage(page)
        .pageSize(messagesPage.getSize())
        .totalPages(messagesPage.getTotalPages())
        .totalElements(messagesPage.getTotalElements())
        .data(
            chatMessageMapper.toChatMessages(
                messagesPage.getContent(), userDetails, MessageType.CHAT))
        .build();
  }
}
