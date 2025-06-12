package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.SocialNetwork.PostLikedEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.repository.PostLikedRepository;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PostLikedService {
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final PostLikedRepository postSavedRepository;
  private final JwtUtils jwtUtils;
  private final UserMapper userMapper;
  private final MessagePublisher publisher;

  public PostLikedService(
      UserRepository userRepository,
      PostRepository postRepository,
      PostLikedRepository postSavedRepository,
      JwtUtils jwtUtils,
      UserMapper userMapper,
      MessagePublisher publisher) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.postSavedRepository = postSavedRepository;
    this.jwtUtils = jwtUtils;
    this.userMapper = userMapper;
    this.publisher = publisher;
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail", "spring-app::rec-posts"},
      allEntries = true)
  public UUID like(UUID postId) {
    UserEntity currentUser =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Post with id: {} liked", postId);
    PostEntity post =
        postRepository
            .findById(postId)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    Optional<PostLikedEntity> existedAction =
        postSavedRepository.findByAuthorAndPost(currentUser, post);
    if (existedAction.isPresent()) {
      throw new AppException(ErrorCode.POST_LIKED_EXISTED);
    }

    PostLikedEntity postLikedEntity =
        PostLikedEntity.builder().id(UUID.randomUUID()).author(currentUser).post(post).build();
    postSavedRepository.save(postLikedEntity);

    postSavedRepository
        .findById(postLikedEntity.getId())
        .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));

    // publish like_count to redis
    Map<String, Object> data = new HashMap<>();
    data.put("postId", post.getId());
    data.put("authorId", currentUser.getId());
    publisher.publish("like_count", String.valueOf(data));
    return postLikedEntity.getId();
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail", "spring-app::rec-posts"},
      allEntries = true)
  public Boolean unlike(UUID postId) {
    UserEntity currentUser =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Post with id: {} liked", postId);
    PostEntity post =
        postRepository
            .findById(postId)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    postSavedRepository
        .findByAuthorAndPost(currentUser, post)
        .orElseThrow(() -> new AppException(ErrorCode.POST_LIKED_NOT_EXISTED));
    postSavedRepository.deleteByAuthorAndPost(currentUser, post);

    // publish unlike_count to redis
    publisher.publish("unlike_count", String.valueOf(post.getId()));
    return true;
  }

  public List<UserProfileResponse> getLikedUsers(UUID postId) {
    PostEntity post =
        postRepository
            .findById(postId)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    List<UserEntity> lstUsers = postSavedRepository.findLikedUsers(post);
    return lstUsers.stream()
        .map(element -> userMapper.map(element, UserProfileResponse.class))
        .toList();
  }
}
