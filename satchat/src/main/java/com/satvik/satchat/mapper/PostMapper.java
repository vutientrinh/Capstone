package com.satvik.satchat.mapper;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.payload.post.PostResponse;
import com.satvik.satchat.repository.PostLikedRepository;
import com.satvik.satchat.repository.PostSavedRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PostMapper {
  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;
  private final PostSavedRepository postSavedRepository;
  private final PostLikedRepository postLikedRepository;

  private final ModelMapper modelMapper = new ModelMapper();

  public PostMapper(
      JwtUtils jwtUtils,
      UserRepository userRepository,
      PostSavedRepository postSavedRepository,
      PostLikedRepository postLikedRepository) {
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
    this.postSavedRepository = postSavedRepository;
    this.postLikedRepository = postLikedRepository;
  }

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return modelMapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error in mapping {} to {}", entity, outClass, e);
      return null;
    }
  }

  public PostResponse toPostResponse(PostEntity post) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Mapping Saved Post to PostResponse
    Boolean hasSaved = false;
    Optional<?> savedPost = postSavedRepository.findByAuthorAndPost(currentUser, post);
    if (savedPost != null && savedPost.isPresent()) {
      hasSaved = true;
    }

    // Mapping Liked Post to PostResponse
    Boolean hasLiked = false;
    Optional<?> likedPost = postLikedRepository.findByAuthorAndPost(currentUser, post);
    if (likedPost != null && likedPost.isPresent()) {
      hasLiked = true;
    }
    // List images
    List<String> images = new ArrayList<>();
    post.getImages().forEach(file -> images.add(file.getFilename()));
    return PostResponse.builder()
        .id(post.getId())
        .content(post.getContent())
        .images(images)
        .authorId(post.getAuthor().getId())
        .topicId(post.getTopic().getId())
        .commentCount(post.getCommentCount())
        .likedCount(post.getLikedCount())
        .type(post.getType().name())
        .status(post.getStatus().name())
        .postStatus(post.getPostStatus().name())
        .hasLiked(hasLiked)
        .hasSaved(hasSaved)
        .createdAt(post.getCreatedAt().toString())
        .updatedAt(post.getUpdatedAt().toString())
        .topic(
            new PostResponse.topic(
                post.getTopic().getId().toString(),
                post.getTopic().getName(),
                post.getTopic().getPostCount(),
                post.getTopic().getColor()))
        .author(
            new PostResponse.author(
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getAuthor().getFirstName(),
                post.getAuthor().getLastName(),
                post.getAuthor().getAvatar()))
        .build();
  }
}
