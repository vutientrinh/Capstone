package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.dto.PostFilter;
import com.satvik.satchat.model.Enum.EPost;
import com.satvik.satchat.model.Enum.EPostType;
import com.satvik.satchat.payload.post.PostCreateRequest;
import com.satvik.satchat.payload.post.PostResponse;
import com.satvik.satchat.payload.post.PostUpdateRequest;
import com.satvik.satchat.service.PostService;
import java.io.IOException;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {
  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @PostMapping(consumes = "multipart/form-data")
  public ResponseEntity<?> createPost(@ModelAttribute PostCreateRequest postCreateRequest) {
    PostResponse post = postService.createPostWithAttachments(postCreateRequest);
    if (post != null) {
      return ResponseEntity.ok(DataResponse.builder().data(post).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping("/{uuid}")
  public ResponseEntity<?> updatePost(
      @PathVariable("uuid") UUID uuid, @ModelAttribute PostUpdateRequest postUpdateRequest) {
    PostResponse result = postService.updatePostAPI(uuid, postUpdateRequest);
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<?> deletePost(@PathVariable("uuid") UUID uuid) {
    Boolean success = postService.deletePostAPI(uuid);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping
  public ResponseEntity<?> listPost(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @RequestParam(value = "type", required = false) Integer type,
      @RequestParam(value = "topicName", required = false) String topicName,
      @RequestParam(value = "authorId", required = false) UUID authorId,
      @RequestParam(value = "keyword", required = false) String keyword) {
    PostFilter filter =
        PostFilter.builder()
            .type(type != null ? EPostType.values()[type] : null)
            .topicName(topicName)
            .authorId(authorId)
            .keyword(keyword)
            .build();
    return ResponseEntity.ok(
        DataResponse.builder().data(postService.listPostAPI(page, size, filter)).build());
  }

  @GetMapping("/trending")
  public ResponseEntity<?> listPostTrending(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @RequestParam(value = "type", required = false) Integer type,
      @RequestParam(value = "topicName", required = false) String topicName,
      @RequestParam(value = "authorId", required = false) UUID authorId,
      @RequestParam(value = "keyword", required = false) String keyword) {
    PostFilter filter =
        PostFilter.builder()
            .type(type != null ? EPostType.values()[type] : null)
            .topicName(topicName)
            .authorId(authorId)
            .keyword(keyword)
            .build();
    return ResponseEntity.ok(
        DataResponse.builder().data(postService.listPostTrendingAPI(page, size, filter)).build());
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<?> getPost(@PathVariable("uuid") UUID uuid) {
    return ResponseEntity.ok(DataResponse.builder().data(postService.getPostAPI(uuid)).build());
  }

  @GetMapping("/search")
  public ResponseEntity<?> searchPost(
      @RequestParam(value = "query", required = false, defaultValue = "") String query,
      @RequestParam(value = "top_k", required = false, defaultValue = "10") int top_k,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size)
      throws IOException, InterruptedException {
    return ResponseEntity.ok(
        DataResponse.builder().data(postService.search(query, top_k, page, size)).build());
  }

  @GetMapping("/{userId}/images")
  public ResponseEntity<?> getUserImages(@PathVariable("userId") UUID userId) {
    return ResponseEntity.ok(
        DataResponse.builder().data(postService.getLstImagesByUserId(userId)).build());
  }

  @PostMapping("/{uuid}/post-status")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> changePostStatus(
      @PathVariable("uuid") UUID uuid, @RequestParam("status") EPost status) {
    PostResponse success = postService.changeStatusPostAPI(uuid, status);
    if (success != null) {
      return ResponseEntity.ok(DataResponse.builder().data(success).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }
}
