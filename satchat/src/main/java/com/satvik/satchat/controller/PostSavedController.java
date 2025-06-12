package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.payload.post.PostResponse;
import com.satvik.satchat.payload.post.PostSavedRequest;
import com.satvik.satchat.service.PostSavedService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostSavedController {

  private final PostSavedService postSavedService;

  public PostSavedController(PostSavedService postSavedService) {
    this.postSavedService = postSavedService;
  }

  @PostMapping("/save")
  public ResponseEntity<?> savePost(@Valid @RequestBody PostSavedRequest postSavedRequest) {
    UUID result = postSavedService.save(postSavedRequest);
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/unsaved")
  public ResponseEntity<?> unsavedPost(@Valid @RequestBody PostSavedRequest postSavedRequest) {
    Boolean success = postSavedService.unsaved(postSavedRequest);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/saved")
  public ResponseEntity<?> getSavedPosts() {
    List<PostResponse> result = postSavedService.getListPostSavedAPI();
    if (result == null || result.isEmpty()) {
      // return 204 if no content
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
  }

  @GetMapping("/lst-saved")
  public ResponseEntity<?> getPostSaved(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    PageResponse<?> result = postSavedService.getPostSaved(page, size);
    return ResponseEntity.ok(DataResponse.builder().data(result).build());
  }
}
