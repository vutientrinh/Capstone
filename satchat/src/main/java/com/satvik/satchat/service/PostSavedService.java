package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.SocialNetwork.PostSavedEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.payload.post.PostResponse;
import com.satvik.satchat.payload.post.PostSavedRequest;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.PostSavedRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PostSavedService {
  private final JwtUtils jwtUtils;
  private final PostMapper postMapper;
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final PostSavedRepository postSavedRepository;

  public PostSavedService(
      UserRepository userRepository,
      PostRepository postRepository,
      PostSavedRepository postSavedRepository,
      JwtUtils jwtUtils,
      PostMapper postMapper) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.postSavedRepository = postSavedRepository;
    this.jwtUtils = jwtUtils;
    this.postMapper = postMapper;
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail", "spring-app::rec-posts"},
      allEntries = true)
  public UUID save(PostSavedRequest postSavedRequest) {
    UserEntity author =
        userRepository
            .findById(postSavedRequest.getAuthorId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    PostEntity post =
        postRepository
            .findById(postSavedRequest.getPostId())
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    Optional<PostSavedEntity> existedAction = postSavedRepository.findByAuthorAndPost(author, post);
    if (existedAction.isPresent()) {
      throw new AppException(ErrorCode.POST_SAVED_EXISTED);
    }

    PostSavedEntity postSavedEntity =
        PostSavedEntity.builder().id(UUID.randomUUID()).author(author).post(post).build();
    postSavedRepository.save(postSavedEntity);

    postSavedRepository
        .findById(postSavedEntity.getId())
        .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));
    return postSavedEntity.getId();
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail", "spring-app::rec-posts"},
      allEntries = true)
  public Boolean unsaved(PostSavedRequest postSavedRequest) {
    UserEntity author =
        userRepository
            .findById(postSavedRequest.getAuthorId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    PostEntity post =
        postRepository
            .findById(postSavedRequest.getPostId())
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    postSavedRepository
        .findByAuthorAndPost(author, post)
        .orElseThrow(() -> new AppException(ErrorCode.POST_SAVED_NOT_EXISTED));
    postSavedRepository.deleteByAuthorAndPost(author, post);

    return true;
  }

  public List<PostResponse> getListPostSavedAPI() {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    List<PostSavedEntity> listPostSaved = postSavedRepository.findByAuthor(currentUser);
    if (listPostSaved != null && !listPostSaved.isEmpty()) {
      List<PostEntity> listPosts =
          listPostSaved.stream()
              .map(postSavedEntity -> postSavedEntity.getPost())
              .collect(Collectors.toList());
      return listPosts.stream()
          .map(element -> postMapper.toPostResponse(element))
          .collect(Collectors.toList());
    }
    return null;
  }

  public PageResponse<PostResponse> getPostSaved(int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var listPostSaved = postSavedRepository.findAllByAuthor(currentUser, pageable);

    List<PostEntity> listPosts =
        listPostSaved.getContent().stream()
            .map(postSavedEntity -> postSavedEntity.getPost())
            .collect(Collectors.toList());
    return PageResponse.<PostResponse>builder()
        .currentPage(page)
        .pageSize(listPostSaved.getSize())
        .totalPages(listPostSaved.getTotalPages())
        .totalElements(listPostSaved.getTotalElements())
        .data(listPosts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
        .build();
  }
}
