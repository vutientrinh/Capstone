package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.dto.PostFilter;
import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.SocialNetwork.TopicEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.model.Enum.EPost;
import com.satvik.satchat.model.Enum.EPostStatus;
import com.satvik.satchat.model.Enum.EPostType;
import com.satvik.satchat.model.Enum.FileStatus;
import com.satvik.satchat.payload.file.FileResponse;
import com.satvik.satchat.payload.post.PostCreateRequest;
import com.satvik.satchat.payload.post.PostResponse;
import com.satvik.satchat.payload.post.PostUpdateRequest;
import com.satvik.satchat.repository.FileRepository;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.TopicRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.utils.FileTypeUtils;
import com.satvik.satchat.utils.HttpHelper;
import com.satvik.satchat.utils.JsonHelper;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class PostService {
  @Value("${semantic.url}")
  private String semantic_search;

  private final PostRepository postRepository;
  private final TopicRepository topicRepository;
  private final UserRepository userRepository;
  private final PostMapper postMapper;
  private final MessagePublisher messagePublisher;
  private final MinioService minioService;
  private final FileRepository fileRepository;
  private final transient HttpHelper httpHelper;

  public PostService(
      PostRepository postRepository,
      TopicRepository topicRepository,
      UserRepository userRepository,
      PostMapper postMapper,
      MessagePublisher messagePublisher,
      MinioService minioService,
      FileRepository fileRepository) {
    this.postRepository = postRepository;
    this.topicRepository = topicRepository;
    this.userRepository = userRepository;
    this.postMapper = postMapper;
    this.messagePublisher = messagePublisher;
    this.minioService = minioService;
    this.fileRepository = fileRepository;
    this.httpHelper = new HttpHelper();
  }

  @Cacheable(
      value = "post:list",
      key =
          "'page=' + #page + ':size=' + #size + ':type=' + (#filter?.type != null ? #filter.type : 'null') + ':topicName=' + (#filter?.topicName != null ? #filter.topicName : 'null') + ':authorId=' + (#filter?.authorId != null ? #filter.authorId : 'null') + ':keyword=' + (#filter?.keyword != null ? #filter.keyword : 'null')")
  public PageResponse<?> listPostAPI(int page, int size, PostFilter filter) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var posts = postRepository.findAllPost(filter, pageable);

    return PageResponse.<PostResponse>builder()
        .currentPage(page)
        .pageSize(posts.getSize())
        .totalPages(posts.getTotalPages())
        .totalElements(posts.getTotalElements())
        .data(posts.stream().map(postMapper::toPostResponse).toList())
        .build();
  }

  @Cacheable(value = "post:detail", key = "'post:' + #uuid")
  public PostResponse getPostAPI(UUID uuid) {
    PostEntity post =
        postRepository
            .findById(uuid)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    return postMapper.toPostResponse(post);
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail"},
      allEntries = true)
  public PostResponse createPostWithAttachments(PostCreateRequest postCreateRequest) {
    TopicEntity topicEntity =
        topicRepository
            .findById(postCreateRequest.getTopicId())
            .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED));

    UserEntity authorEntity =
        userRepository
            .findById(postCreateRequest.getAuthorId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Upload multiple images to MinIO
    List<FileEntity> images = new ArrayList<>();
    if (postCreateRequest.getImages() != null) {
      for (MultipartFile image : postCreateRequest.getImages()) {
        String fileType = "";
        if (image != null && !image.isEmpty()) {
          fileType = FileTypeUtils.getFileType(image);
        }

        FileResponse object = minioService.putObject(image, "commons", fileType);
        FileEntity entity =
            fileRepository
                .findByFilename(object.getFilename())
                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));
        images.add(entity);
      }
    }

    // Mapping the post entity
    PostEntity newPost =
        PostEntity.builder()
            .id(UUID.randomUUID())
            .content(postCreateRequest.getContent())
            .images(images)
            .author(authorEntity)
            .topic(topicEntity)
            .status(EPostStatus.PUBLIC)
            .type(EPostType.TEXT)
            .build();
    postRepository.save(newPost);

    /** Check if the post is created successfully */
    postRepository
        .findById(newPost.getId())
        .orElseThrow(() -> new AppException(ErrorCode.POST_CREATION_FAILED));

    // post-create socket
    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronizationAdapter() {
          @Override
          public void afterCommit() {
            messagePublisher.publish("post_create", String.valueOf(newPost.getId()));
          }
        });
    return postMapper.toPostResponse(newPost);
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail"},
      allEntries = true)
  public PostResponse updatePostAPI(UUID uuid, PostUpdateRequest request) {
    PostEntity post =
        postRepository
            .findById(uuid)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    UUID topicId = request.getTopicId();
    TopicEntity topic =
        (topicId != null)
            ? topicRepository
                .findById(topicId)
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_EXISTED))
            : post.getTopic();

    // convert new multiples images to file entities
    List<FileEntity> images = new ArrayList<>();
    if (request.getImages() != null) {
      for (MultipartFile image : request.getImages()) {
        String fileType = "";
        if (image != null && !image.isEmpty()) {
          fileType = FileTypeUtils.getFileType(image);
        }

        FileResponse object = minioService.putObject(image, "commons", fileType);
        FileEntity entity =
            fileRepository
                .findByFilename(object.getFilename())
                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));
        images.add(entity);
      }
    }

    // Update images & save to current post
    post.setImages(images);
    postRepository.save(post);

    // Update post entity
    postRepository.updatePost(
        post.getId(),
        request.getContent() != null ? request.getContent() : post.getContent(),
        topic,
        request.getStatus() != null ? request.getStatus() : post.getStatus(),
        request.getType() != null ? request.getType() : post.getType());

    return postMapper.toPostResponse(post);
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail"},
      allEntries = true)
  public Boolean deletePostAPI(UUID uuid) {
    PostEntity post =
        postRepository
            .findById(uuid)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    // set DELETE status
    post.getImages().forEach(image -> image.setStatus(FileStatus.DELETED));

    // Delete post
    post.setPostStatus(EPost.DELETED);
    postRepository.save(post);
    // postRepository.deleteById(uuid);

    // post-delete socket
    messagePublisher.publish("post_delete", String.valueOf(post.getAuthor().getId()));
    return true;
  }

  @Cacheable(
      value = "post:list",
      key =
          "'trending:page=' + #page + ':size=' + #size + ':type=' + (#filter?.type != null ? #filter.type : 'null') + ':topicName=' + (#filter?.topicName != null ? #filter.topicName : 'null') + ':authorId=' + (#filter?.authorId != null ? #filter.authorId : 'null') + ':keyword=' + (#filter?.keyword != null ? #filter.keyword : 'null')")
  public PageResponse<?> listPostTrendingAPI(int page, int size, PostFilter filter) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    String[] sortFields = {"createdAt", "likedCount", "commentCount"};
    Sort sort = Sort.by(Sort.Direction.DESC, sortFields);
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var posts = postRepository.findAllPostTrending(filter, pageable);

    return PageResponse.<PostResponse>builder()
        .currentPage(page)
        .pageSize(posts.getSize())
        .totalPages(posts.getTotalPages())
        .totalElements(posts.getTotalElements())
        .data(posts.stream().map(postMapper::toPostResponse).toList())
        .build();
  }

  public List<PostResponse> search(String query, int top_k, int page, int size)
      throws IOException, InterruptedException {
    String URL =
        semantic_search.replace("{query}", query).replace("{top_k}", String.valueOf(top_k));
    var response = httpHelper.getJson(URL);
    log.info("Response from semantic search: {}", JsonHelper.extractIds(response).size());
    List<UUID> uuids = JsonHelper.extractIds(response);
    List<PostResponse> postResponses = new ArrayList<>();
    for (UUID uuid : uuids) {
      PostEntity post =
          postRepository
              .findById(uuid)
              .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
      postResponses.add(postMapper.toPostResponse(post));
    }
    return postResponses;
  }

  public List<String> getLstImagesByUserId(UUID userId) {
    List<PostEntity> posts = postRepository.findAllByAuthorId(userId);
    List<String> lstImages = new ArrayList<>();
    for (PostEntity post : posts) {
      for (FileEntity image : post.getImages()) {
        if (image.getStatus() == FileStatus.ACTIVE) {
          lstImages.add(image.getFilename());
        }
      }
    }
    return lstImages;
  }

  @Transactional
  @CacheEvict(
      value = {"post:list", "post:detail"},
      allEntries = true)
  public PostResponse changeStatusPostAPI(UUID uuid, EPost status) {
    PostEntity post =
        postRepository
            .findById(uuid)
            .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

    post.setPostStatus(status);
    postRepository.save(post);
    return postMapper.toPostResponse(post);
  }
}
