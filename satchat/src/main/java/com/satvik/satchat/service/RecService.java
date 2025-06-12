package com.satvik.satchat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.mapper.ProductMapper;
import com.satvik.satchat.payload.post.PostResponse;
import com.satvik.satchat.payload.product.ProductResponse;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.ProductRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.HttpHelper;
import com.satvik.satchat.utils.JsonHelper;
import com.satvik.satchat.utils.JwtUtils;
import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class RecService {

  @Value("${springai.posts}")
  private String recPostUrl;

  @Value("${springai.products}")
  private String recProductUrl;

  private final RestTemplate restTemplate;
  private final transient HttpHelper httpHelper;
  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final ProductRepository productRepository;
  private final RedisTemplate<String, String> redisTemplate;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final PostMapper postMapper;
  private final ProductMapper productMapper;

  public RecService(
      RestTemplate restTemplate,
      JwtUtils jwtUtils,
      UserRepository userRepository,
      PostRepository postRepository,
      ProductRepository productRepository,
      RedisTemplate<String, String> redisTemplate,
      PostMapper postMapper,
      ProductMapper productMapper) {
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.productRepository = productRepository;
    this.redisTemplate = redisTemplate;
    this.postMapper = postMapper;
    this.productMapper = productMapper;
    this.httpHelper = new HttpHelper();
    this.restTemplate = restTemplate;
  }

  public PageResponse<PostResponse> getRecPosts(int page, int size)
      throws IOException, InterruptedException {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity userEntity =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    String redisKey = "spring-app::rec-posts::" + userEntity.getId() + "::" + page;

    List<UUID> finalList;
    String cachedPosts = redisTemplate.opsForValue().get(redisKey);
    if (cachedPosts != null) {
      finalList = JsonHelper.extractUUIDs(cachedPosts.replace("\"", ""));
    } else {
      var lstPosts = httpHelper.postJson(recPostUrl, String.valueOf(userEntity.getId()));
      List<UUID> recPostIds = JsonHelper.extractUUIDs(lstPosts);

      // Trending posts
      List<UUID> trendingPostIds = postRepository.findAllPostIdsTrending();
      Set<UUID> mergedSet = new LinkedHashSet<>();
      mergedSet.addAll(recPostIds);
      mergedSet.addAll(trendingPostIds);

      finalList = new ArrayList<>(mergedSet);

      // Caching
      String jsonList = objectMapper.writeValueAsString(finalList);
      redisTemplate.opsForValue().set(redisKey, jsonList, Duration.ofMinutes(1));
    }

    // Pagination
    int totalElements = finalList.size();
    int totalPages = (int) Math.ceil((double) totalElements / size);
    long skip = (long) (page - 1) * size;
    List<UUID> pageIds = finalList.stream().skip(skip).limit(size).collect(Collectors.toList());
    List<PostResponse> responses = new ArrayList<>();
    for (UUID postId : pageIds) {
      PostResponse postResponse =
          postRepository
              .findById(postId)
              .map(postMapper::toPostResponse)
              .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
      responses.add(postResponse);
    }

    return PageResponse.<PostResponse>builder()
        .currentPage(page)
        .pageSize(responses.size())
        .totalPages(totalPages)
        .totalElements(totalElements)
        .data(responses)
        .build();
  }

  public PageResponse<ProductResponse> getRecProducts(int page, int size)
      throws IOException, InterruptedException {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity userEntity =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    String redisKey = "spring-app::rec-products::" + userEntity.getId() + "::" + page;

    List<UUID> finalList = new ArrayList<>();
    String cachedPosts = redisTemplate.opsForValue().get(redisKey);
    if (cachedPosts != null) {
      finalList = JsonHelper.extractUUIDs(cachedPosts.replace("\"", ""));
    } else {
      var lstProducts = httpHelper.postJson(recProductUrl, String.valueOf(userEntity.getId()));
      List<UUID> recProductIds = JsonHelper.extractUUIDs(lstProducts);

      // All products
      List<ProductEntity> allProductIds = productRepository.findAll();
      List<UUID> allProductUUIDs =
          allProductIds.stream().map(ProductEntity::getId).collect(Collectors.toList());

      // Merging
      Set<UUID> mergedSet = new LinkedHashSet<>();
      mergedSet.addAll(recProductIds);
      mergedSet.addAll(allProductUUIDs);

      finalList = new ArrayList<>(mergedSet);

      // Caching
      String jsonList = objectMapper.writeValueAsString(finalList);
      redisTemplate.opsForValue().set(redisKey, jsonList, Duration.ofMinutes(1));
    }

    // Pagination
    int totalElements = finalList.size();
    int totalPages = (int) Math.ceil((double) totalElements / size);
    long skip = (long) (page - 1) * size;
    List<UUID> pageIds = finalList.stream().skip(skip).limit(size).collect(Collectors.toList());
    List<ProductResponse> responses = new ArrayList<>();
    for (UUID id : pageIds) {
      ProductResponse response =
          productRepository
              .findById(id)
              .map(productMapper::toResponse)
              .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
      responses.add(response);
    }
    return PageResponse.<ProductResponse>builder()
        .currentPage(page)
        .pageSize(responses.size())
        .totalPages(totalPages)
        .totalElements(totalElements)
        .data(responses)
        .build();
  }

  public PageResponse<PostResponse> getRecPostByUserId(UUID userId, int page, int size)
      throws IOException, InterruptedException {
    UserEntity userEntity =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    String redisKey = "spring-app::rec-posts::" + userEntity.getId() + "::" + page;

    List<UUID> finalList = new ArrayList<>();
    String cachedPosts = redisTemplate.opsForValue().get(redisKey);
    if (cachedPosts != null) {
      finalList = JsonHelper.extractUUIDs(cachedPosts.replace("\"", ""));
    } else {
      var lstPosts = httpHelper.postJson(recPostUrl, String.valueOf(userEntity.getId()));
      List<UUID> recPostIds = JsonHelper.extractUUIDs(lstPosts);

      // Trending posts
      List<UUID> trendingPostIds = postRepository.findAllPostIdsTrending();
      Set<UUID> mergedSet = new LinkedHashSet<>();
      mergedSet.addAll(recPostIds);
      mergedSet.addAll(trendingPostIds);

      finalList = new ArrayList<>(mergedSet);
    }

    // Pagination
    int totalElements = finalList.size();
    int totalPages = (int) Math.ceil((double) totalElements / size);
    long skip = (long) (page - 1) * size;
    List<UUID> pageIds = finalList.stream().skip(skip).limit(size).collect(Collectors.toList());
    List<PostResponse> responses = new ArrayList<>();
    for (UUID postId : pageIds) {
      PostResponse postResponse =
          postRepository
              .findById(postId)
              .map(postMapper::toPostResponse)
              .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
      responses.add(postResponse);
    }

    return PageResponse.<PostResponse>builder()
        .currentPage(page)
        .pageSize(responses.size())
        .totalPages(totalPages)
        .totalElements(totalElements)
        .data(responses)
        .build();
  }
}
