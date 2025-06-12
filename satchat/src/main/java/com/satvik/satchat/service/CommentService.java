package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.CommentEntity;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.mapper.CommentMapper;
import com.satvik.satchat.model.Enum.EComment;
import com.satvik.satchat.payload.comment.CommentCreationRequest;
import com.satvik.satchat.payload.comment.CommentLikedResponse;
import com.satvik.satchat.payload.comment.CommentResponse;
import com.satvik.satchat.payload.comment.CommentUpdateRequest;
import com.satvik.satchat.repository.CommentLikedRepository;
import com.satvik.satchat.repository.CommentRepository;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CommentService {

  private final CommentRepository commentRepository;
  private final CommentLikedRepository commentLikedRepository;
  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final CommentMapper commentMapper;
  private final JwtUtils jwtUtils;
  private final MessagePublisher publisher;

  public CommentService(
      CommentRepository commentRepository,
      CommentLikedRepository commentLikedRepository,
      PostRepository postRepository,
      UserRepository userRepository,
      CommentMapper commentMapper,
      JwtUtils jwtUtils,
      MessagePublisher publisher) {
    this.commentRepository = commentRepository;
    this.commentLikedRepository = commentLikedRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.commentMapper = commentMapper;
    this.jwtUtils = jwtUtils;
    this.publisher = publisher;
  }

  @Transactional
  public CommentResponse create(CommentCreationRequest request) {
    UserEntity author =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    PostEntity post =
        postRepository
            .findById(request.getPostId())
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    CommentEntity comment =
        CommentEntity.builder()
            .id(UUID.randomUUID())
            .author(author)
            .post(post)
            .status(EComment.APPROVED)
            .content(request.getContent())
            .build();
    commentRepository.save(comment);

    // check create success
    commentRepository
        .findById(comment.getId())
        .orElseThrow(() -> new AppException(ErrorCode.COMMENT_CREATION_FAILED));

    // Comment_Like Count
    Map<String, Object> data = new HashMap<>();
    data.put("postId", post.getId());
    data.put("authorId", author.getId());
    publisher.publish("comment_create", String.valueOf(data));
    return commentMapper.toCommentResponse(comment);
  }

  @Transactional
  public Boolean update(UUID id, CommentUpdateRequest request) {

    // Check author of comment
    UserEntity author =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (!commentRepository.findById(id).get().getAuthor().getId().equals(author.getId())) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    // check comment exist
    CommentEntity comment =
        commentRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

    comment.setContent(request.getContent());
    commentRepository.save(comment);

    // check update success
    commentRepository
        .findById(comment.getId())
        .orElseThrow(() -> new AppException(ErrorCode.COMMENT_UPDATE_FAILED));
    return true;
  }

  @Transactional
  public Boolean delete(UUID id) {
    // Check author of comment
    UserEntity author =
        userRepository
            .findByUsername(jwtUtils.getUserDetailsFromJwtToken().getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    CommentEntity getComment = commentRepository.findById(id).get();
    String authorId = getComment.getAuthor().getId().toString();
    if (!author.getId().equals(UUID.fromString(authorId))) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    // check comment exist
    CommentEntity comment =
        commentRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

    if (comment.getStatus().equals(EComment.DELETED)) {
      throw new AppException(ErrorCode.COMMENT_ALREADY_DELETED);
    }

    comment.setStatus(EComment.DELETED);
    commentRepository.save(comment);

    // check delete success
    Optional<CommentEntity> isDeleted = commentRepository.isDeleted(comment.getId());
    if (!isDeleted.isPresent()) {
      throw new AppException(ErrorCode.COMMENT_DELETE_FAILED);
    }

    // Comment_Like Count
    Map<String, Object> data = new HashMap<>();
    data.put("postId", comment.getPost().getId());
    data.put("authorId", author.getId());
    publisher.publish("comment_delete", String.valueOf(data));
    return true;
  }

  public PageResponse<CommentResponse> getComments(int page, int size) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var comments = commentRepository.getComments(currentUser.getId(), pageable);

    return PageResponse.<CommentResponse>builder()
        .currentPage(page)
        .pageSize(comments.getSize())
        .totalPages(comments.getTotalPages())
        .totalElements(comments.getTotalElements())
        .data(comments.stream().map(commentMapper::toCommentResponse).toList())
        .build();
  }

  public PageResponse<CommentLikedResponse> getCommentByPost(int page, int size, UUID postId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var comments = commentRepository.getCommentByPost(postId, pageable);

    // check current user liked comment
    List<CommentLikedResponse> commentLikedResponses = new ArrayList<>();
    comments.forEach(
        comment -> {
          List<UserEntity> lstLikedUsers =
              commentLikedRepository.findAllLikedUsers(comment.getId());
          if (lstLikedUsers.contains(currentUser)) {
            commentLikedResponses.add(commentMapper.toCommentLikedResponse(comment, true));
          } else commentLikedResponses.add(commentMapper.toCommentLikedResponse(comment, false));
        });

    return PageResponse.<CommentLikedResponse>builder()
        .currentPage(page)
        .pageSize(comments.getSize())
        .totalPages(comments.getTotalPages())
        .totalElements(comments.getTotalElements())
        .data(commentLikedResponses)
        .build();
  }

  public Boolean setCommentStatus(UUID id, String status) {
    EComment commentStatus = EComment.valueOf(status.toUpperCase());
    var comment =
        commentRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
    comment.setStatus(commentStatus);
    commentRepository.save(comment);
    return true;
  }
}
