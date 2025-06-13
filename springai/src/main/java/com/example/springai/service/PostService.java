package com.example.springai.service;

import com.example.springai.dto.Parts;
import com.example.springai.dto.Prompt;
import com.example.springai.entity.PostKeyword;
import com.example.springai.entity.UserInterestKeyword;
import com.example.springai.model.Post;
import com.example.springai.repository.PostKeywordRepository;
import com.example.springai.repository.PostRepository;
import com.example.springai.repository.UserInterestKeywordRepository;
import com.example.springai.repository.UserRepository;
import com.example.springai.utils.RequestUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PostService {
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final PostKeywordRepository postKeywordRepository;
  private final UserInterestKeywordRepository userInterestKeywordRepository;
  private final AppService appService;
  private final RequestUtils requestUtils;

  public PostService(
      UserRepository userRepository,
      PostRepository postRepository,
      PostKeywordRepository postKeywordRepository,
      UserInterestKeywordRepository userInterestKeywordRepository,
      AppService appService,
      RequestUtils requestUtils) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.postKeywordRepository = postKeywordRepository;
    this.userInterestKeywordRepository = userInterestKeywordRepository;
    this.appService = appService;
    this.requestUtils = requestUtils;
  }

  public void insertPost(String json) throws Exception {
    log.info("Inserting post data: {}", json);
    json = json.replaceAll("\"null\"", "null");
    ObjectMapper mapper = new ObjectMapper();
    mapper.findAndRegisterModules();
    Post post = mapper.readValue(json, Post.class);

    if (!postRepository.existsById(post.getId())) {
      log.info("Post with ID {} does not exist. Inserting new post.", post.getId());
      postRepository.insertPost(
          post.getId(),
          post.getCreatedAt(),
          post.getUpdatedAt(),
          post.getCommentCount(),
          post.getContent(),
          post.getImages(),
          post.getLikedCount(),
          post.getStatus(),
          post.getType(),
          post.getAuthor(),
          post.getTopic(),
          post.getPostStatus());

      if (!postKeywordRepository.isExistKeywords(post.getId())) {
        // set post's keywords
        Parts parts = new Parts();
        parts.setText(post.getContent());
        Prompt prompt = requestUtils.bodyExtractKeywords(parts);
        String keywords = appService.getKeywords(prompt, parts);

        postKeywordRepository.save(
            PostKeyword.builder().postId(post.getId()).keyword(keywords).build());
      }
    }
  }

  public void setUserKeywords(String json) throws JsonProcessingException {
    log.info("Setting user keywords: {}", json);
    json = json.replaceAll("\"null\"", "null");
    ObjectMapper mapper = new ObjectMapper();
    mapper.findAndRegisterModules();
    Map<String, Object> postLiked =
        mapper.readValue(json, new TypeReference<Map<String, Object>>() {});

    // Get information from JSON
    String postId = (String) postLiked.get("post");
    String authorId = (String) postLiked.get("author");

    if (postId.length() == 36 && authorId.length() == 36) {
      String keywords = postRepository.getKeywordsByPostId(postId);
      String reKeywords = userRepository.keywordExists(authorId);

      if (keywords != null && keywords.length() > 0) {
        keywords = keywords.replace("[", "").replace("]", "");
      }
      if (reKeywords != null && reKeywords.length() > 0) {
        reKeywords = reKeywords.replace("[", "").replace("]", "");
      }

      Set<String> mergedKeywords = new LinkedHashSet<>();
      if (keywords != null && !keywords.isEmpty()) {
        for (String keyword : keywords.split(",")) {
          mergedKeywords.add(keyword.trim());
        }
      }
      if (reKeywords != null && !reKeywords.isEmpty()) {
        for (String keyword : reKeywords.split(",")) {
          mergedKeywords.add(keyword.trim());
        }
      }

      String result = "[" + String.join(",", mergedKeywords) + "]";
      if (userInterestKeywordRepository.existsRecord(authorId, result)) {
        log.info("User interest keyword already exists for userId: {}", authorId);
        return;
      }

      Optional<UserInterestKeyword> existing = userInterestKeywordRepository.findByUserId(authorId);
      if (existing.isPresent()) {
        UserInterestKeyword entity = existing.get();
        entity.setKeyword(result);
        userInterestKeywordRepository.save(entity);
        log.info("Updated user interest keyword for userId: {}", authorId);
      } else {
        userInterestKeywordRepository.save(
            UserInterestKeyword.builder().userId(authorId).keyword(result).build());
        log.info("Inserted new user interest keyword for userId: {}", authorId);
      }
    }
  }
}
