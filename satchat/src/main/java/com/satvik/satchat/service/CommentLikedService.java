package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.CommentEntity;
import com.satvik.satchat.entity.SocialNetwork.CommentLikedEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.repository.CommentLikedRepository;
import com.satvik.satchat.repository.CommentRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CommentLikedService {
  private final CommentLikedRepository commentLikedRepository;
  private final UserRepository userRepository;
  private final CommentRepository commentRepository;
  private final UserMapper userMapper;
  private final JwtUtils jwtUtils;
  private final MessagePublisher messagePublisher;

  public CommentLikedService(
      CommentLikedRepository commentLikedRepository,
      UserRepository userRepository,
      CommentRepository commentRepository,
      UserMapper userMapper,
      JwtUtils jwtUtils,
      MessagePublisher messagePublisher) {
    this.commentLikedRepository = commentLikedRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
    this.userMapper = userMapper;
    this.jwtUtils = jwtUtils;
    this.messagePublisher = messagePublisher;
  }

  public Boolean like(UUID commentId) {
    // Get user details
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity author =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Check comment existed
    log.info("User liked comment with id: {}", commentId);
    CommentEntity comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

    // Check if user already liked this comment
    Optional<CommentLikedEntity> liked =
        commentLikedRepository.findByAuthorAndCommentId(author.getId(), commentId);
    if (liked.isPresent()) {
      log.info("User already liked this comment");
      throw new AppException(ErrorCode.USER_ALREADY_LIKED_COMMENT);
    }

    CommentLikedEntity commentLiked =
        CommentLikedEntity.builder().id(UUID.randomUUID()).author(author).comment(comment).build();
    commentLikedRepository.save(commentLiked);

    // comment_liked
    Map<String, Object> data = new HashMap<>();
    data.put("commentId", commentLiked.getComment().getId());
    data.put("userLikedId", commentLiked.getAuthor().getId());
    messagePublisher.publish("comment_liked", data.toString());
    return true;
  }

  public Boolean unlike(UUID commentId) {
    // Get user details
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity author =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Check comment existed
    log.info("User liked comment with id: {}", commentId);
    CommentEntity comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

    // Check if user already liked this comment
    commentLikedRepository
        .findByAuthorAndCommentId(author.getId(), commentId)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_LIKED_COMMENT));
    commentLikedRepository.deleteByAuthorAndCommentId(author.getId(), commentId);

    // comment_unliked
    messagePublisher.publish("comment_unliked", commentId.toString());
    return true;
  }

  public PageResponse<UserProfileResponse> getLikedUsers(UUID commentId, int page, int size) {
    // Check comment existed
    log.info("Get liked users of comment with id: {}", commentId);
    commentRepository
        .findById(commentId)
        .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

    // Check pagination params
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var likedUsers = commentLikedRepository.findLikedUsers(commentId, pageable);

    return PageResponse.<UserProfileResponse>builder()
        .currentPage(page)
        .pageSize(likedUsers.getSize())
        .totalPages(likedUsers.getTotalPages())
        .totalElements(likedUsers.getTotalElements())
        .data(
            likedUsers.getContent().stream()
                .map(item -> userMapper.map(item, UserProfileResponse.class))
                .toList())
        .build();
  }
}
