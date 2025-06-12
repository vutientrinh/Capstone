package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.FollowEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.payload.user.UserFollowResponse;
import com.satvik.satchat.repository.FollowRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FollowService {
  private final FollowRepository followRepository;
  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final JwtUtils jwtUtils;
  private final MessagePublisher publisher;

  public FollowService(
      FollowRepository followRepository,
      UserRepository userRepository,
      UserMapper userMapper,
      JwtUtils jwtUtils,
      MessagePublisher publisher) {
    this.followRepository = followRepository;
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.jwtUtils = jwtUtils;
    this.publisher = publisher;
  }

  @Transactional
  public Boolean follow(UUID followingId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity follower =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // check user follow themselves
    if (follower.getId().equals(followingId)) {
      log.error("User cannot follow themselves");
      throw new AppException(ErrorCode.FOLLOW_YOURSELF_ERROR);
    }

    UserEntity following =
        userRepository
            .findById(followingId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // check existing follow
    followRepository
        .findFollowByFollowerIdAndFollowingId(follower.getId(), followingId)
        .ifPresent(
            follow -> {
              log.error("User already followed");
              throw new AppException(ErrorCode.FOLLOW_EXISTED_ERROR);
            });

    FollowEntity entity =
        FollowEntity.builder()
            .id(UUID.randomUUID())
            .follower(follower)
            .following(following)
            .build();
    followRepository.save(entity);

    // publish follow_count to redis
    Map<String, Object> data = new HashMap<>();
    data.put("followerId", follower.getId());
    data.put("followingId", following.getId());
    publisher.publish("follow_count", String.valueOf(data));
    return true;
  }

  @Transactional
  public Boolean unfollow(UUID followingId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity follower =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    userRepository
        .findById(followingId)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Check follow before delete
    FollowEntity follow =
        followRepository
            .findFollowByFollowerIdAndFollowingId(follower.getId(), followingId)
            .orElseThrow(() -> new AppException(ErrorCode.FOLLOW_NOT_EXISTED_ERROR));
    followRepository.deleteByFollowId(follow.getId());

    // publish unfollow_count to redis
    publisher.publish("unfollow_count", String.valueOf(followingId));
    return true;
  }

  public PageResponse<UserFollowResponse> listFollowers(UUID userId, int page, int size) {
    log.info("List followers of user: {}", userId);
    userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var listFollowers = followRepository.findFollowersByUserId(userId, pageable);

    // map to UserProfileResponse
    List<UserFollowResponse> responseList =
        listFollowers.getContent().stream().map(userMapper::toUserFollowResponse).toList();

    // update hasFollowedBack
    List<UUID> lstFollowingIds = followRepository.findFollowingIdsByUserId(userId);
    responseList.forEach(item -> item.setHasFollowedBack(lstFollowingIds.contains(item.getId())));

    return PageResponse.<UserFollowResponse>builder()
        .currentPage(page)
        .pageSize(listFollowers.getSize())
        .totalPages(listFollowers.getTotalPages())
        .totalElements(listFollowers.getTotalElements())
        .data(responseList)
        .build();
  }

  public PageResponse<UserFollowResponse> listFollowings(UUID userId, int page, int size) {
    log.info("List followings of user: {}", userId);
    userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var listFollowings = followRepository.findFollowingsByUserId(userId, pageable);

    // map to UserProfileResponse
    List<UserFollowResponse> responseList =
        listFollowings.getContent().stream().map(userMapper::toUserFollowResponse).toList();

    // update hasFollowedBack
    List<UUID> lstFollowerIds = followRepository.findFollowerIdsByUserId(userId);
    responseList.forEach(item -> item.setHasFollowedBack(lstFollowerIds.contains(item.getId())));

    return PageResponse.<UserFollowResponse>builder()
        .currentPage(page)
        .pageSize(listFollowings.getSize())
        .totalPages(listFollowings.getTotalPages())
        .totalElements(listFollowings.getTotalElements())
        .data(responseList)
        .build();
  }

  public Boolean hasFollowed(UUID targetUserId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (currentUser.getId().equals(targetUserId)) {
      log.error("User cannot follow themselves");
      throw new AppException(ErrorCode.FOLLOW_YOURSELF_ERROR);
    }

    return followRepository
        .findFollowByFollowerIdAndFollowingId(currentUser.getId(), targetUserId)
        .isPresent();
  }
}
