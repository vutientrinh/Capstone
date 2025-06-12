package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.dto.NotificationFilter;
import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.NotificationMapper;
import com.satvik.satchat.payload.notification.NotificationCreateRequest;
import com.satvik.satchat.payload.notification.NotificationResponse;
import com.satvik.satchat.repository.NotificationRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

  private final UserRepository userRepository;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final JwtUtils jwtUtils;

  public NotificationService(
      UserRepository userRepository,
      NotificationRepository notificationRepository,
      NotificationMapper notificationMapper,
      JwtUtils jwtUtils) {
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
    this.notificationMapper = notificationMapper;
    this.jwtUtils = jwtUtils;
  }

  public UUID create(NotificationCreateRequest request) {
    log.info(
        "Creating notification for receiverId: {} and actorId: {}",
        request.getReceiverId(),
        request.getActorId());

    UserEntity actor;
    UserEntity receiver;

    if (request.getActorId().equals(request.getReceiverId())) {
      actor =
          receiver =
              userRepository
                  .findById(request.getActorId())
                  .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    } else {
      actor =
          userRepository
              .findById(request.getActorId())
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

      receiver =
          userRepository
              .findById(request.getReceiverId())
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    // Set content
    String content = "";
    switch (String.valueOf(request.getMessageType())) {
      case "FRIEND_REQUEST":
        content = actor.getFullName() + " sent you a friend request";
        break;
      case "FRIEND_REQUEST_ACCEPTED":
        content = actor.getFullName() + " accepted your friend request";
        break;
      case "LIKE_POST":
        content = actor.getFullName() + " liked your post";
        break;
      case "COMMENT_POST":
        content = actor.getFullName() + " commented on your post";
        break;
      case "FOLLOW_USER":
        content = actor.getFullName() + " followed you";
        break;
      case "COMMENT_LIKED":
        content = actor.getFullName() + " liked your comment";
        break;
      default:
        break;
    }

    NotificationEntity notificationEntity =
        NotificationEntity.builder()
            .id(UUID.randomUUID())
            .receiver(receiver)
            .actor(actor)
            .isSent(false)
            .isRead(false)
            .content(content)
            .messageType(request.getMessageType())
            .build();
    notificationRepository.save(notificationEntity);

    // check if notification is sent
    notificationRepository
        .findById(notificationEntity.getId())
        .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_CREATED));

    return notificationEntity.getId();
  }

  public Boolean read(UUID notificationId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity receiver =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    NotificationEntity not =
        notificationRepository
            .findById(notificationId)
            .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_EXISTED));

    if (!receiver.equals(not.getReceiver())) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    // Set notification as read
    not.setIsRead(true);
    notificationRepository.save(not);

    return true;
  }

  public Boolean readAll() {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity receiver =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    notificationRepository
        .findAllByReceiver(receiver)
        .forEach(
            notificationEntity -> {
              notificationEntity.setIsRead(true);
              notificationRepository.save(notificationEntity);
            });

    return true;
  }

  public PageResponse<NotificationResponse> getNotifications(
      int page, int size, NotificationFilter filter) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity receiver =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var notifications = notificationRepository.pagingAllByReceiver(receiver, filter, pageable);

    return PageResponse.<NotificationResponse>builder()
        .currentPage(page)
        .pageSize(notifications.getSize())
        .totalPages(notifications.getTotalPages())
        .totalElements(notifications.getTotalElements())
        .data(notifications.getContent().stream().map(notificationMapper::toResponse).toList())
        .build();
  }
}
