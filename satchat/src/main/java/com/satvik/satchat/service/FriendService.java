package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.FriendEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.model.Enum.EFriend;
import com.satvik.satchat.payload.user.RequestResponse;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.repository.FriendRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FriendService {
  private final FriendRepository friendRepository;
  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final JwtUtils jwtUtils;
  private final MessagePublisher publisher;

  public FriendService(
      FriendRepository friendRepository,
      UserRepository userRepository,
      UserMapper userMapper,
      JwtUtils jwtUtils,
      MessagePublisher publisher) {
    this.friendRepository = friendRepository;
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.jwtUtils = jwtUtils;
    this.publisher = publisher;
  }

  @Transactional
  public UUID addFriend(UUID requesterId, UUID receiverId) {
    if (requesterId.equals(receiverId)) {
      log.error("Requester and receiver cannot be the same");
      throw new AppException(ErrorCode.FRIEND_YOURSELF_ERROR);
    }

    // Get user by id
    UserEntity requester =
        userRepository
            .findById(requesterId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    UserEntity receiver =
        userRepository
            .findById(receiverId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (friendRepository.existsByRequesterAndReceiver(requesterId, receiverId).isPresent()) {
      log.error("Friend request already exists");
      throw new AppException(ErrorCode.FRIEND_REQUEST_ALREADY_EXISTS);
    }

    // New request status: PENDING
    FriendEntity entity =
        FriendEntity.builder()
            .id(UUID.randomUUID())
            .requester(requester)
            .receiver(receiver)
            .build();
    friendRepository.save(entity);

    // friend_request notification
    Map<String, Object> data = new HashMap<>();
    data.put("requesterId", requester.getId());
    data.put("receiverId", receiver.getId());
    publisher.publish("friend_request", String.valueOf(data));
    return entity.getId();
  }

  @Transactional
  public Boolean acceptFriend(UUID friendRequestId) {
    // check friendRequest exists
    FriendEntity entity =
        friendRepository
            .findById(friendRequestId)
            .orElseThrow(() -> new AppException(ErrorCode.FRIEND_NOT_EXISTED_ERROR));

    // Update and add friend
    UUID newRelationship =
        this.addFriend(entity.getReceiver().getId(), entity.getRequester().getId());
    friendRepository.updateRequestStatus(friendRequestId, EFriend.ACCEPTED);
    friendRepository.updateRequestStatus(newRelationship, EFriend.ACCEPTED);

    // friend_accept notification
    Map<String, Object> data = new HashMap<>();
    data.put("requesterId", entity.getReceiver().getId());
    data.put("receiverId", entity.getRequester().getId());
    publisher.publish("friend_accept", String.valueOf(data));
    return true;
  }

  @Transactional
  public Boolean removeFriend(UUID receiverId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity requester =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (!friendRepository.existsByRequesterAndReceiver(receiverId, requester.getId()).isPresent()) {
      log.error("Friend request does not exist");
      throw new AppException(ErrorCode.FRIEND_NOT_EXISTED_ERROR);
    }

    friendRepository.deleteByRequesterAndReceiver(receiverId, requester.getId());

    // unfriend notification & count
    Map<String, Object> data = new HashMap<>();
    data.put("requesterId", requester.getId());
    data.put("receiverId", receiverId);
    publisher.publish("unfriend", String.valueOf(data));
    return true;
  }

  public PageResponse<UserProfileResponse> getAllFriends(UUID userId, int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var users = friendRepository.findAllFriendsById(userId, EFriend.ACCEPTED, pageable);

    return PageResponse.<UserProfileResponse>builder()
        .currentPage(page)
        .pageSize(users.getSize())
        .totalPages(users.getTotalPages())
        .totalElements(users.getTotalElements())
        .data(
            users.getContent().stream()
                .map(item -> userMapper.map(item, UserProfileResponse.class))
                .toList())
        .build();
  }

  public PageResponse<RequestResponse> getAllFriendRequests(UUID userId, int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var users = friendRepository.findAllFriendRequestsById(userId, EFriend.PENDING, pageable);

    return PageResponse.<RequestResponse>builder()
        .currentPage(page)
        .pageSize(users.getSize())
        .totalPages(users.getTotalPages())
        .totalElements(users.getTotalElements())
        .data(users.getContent().stream().map(item -> userMapper.toRequestResponse(item)).toList())
        .build();
  }
}
