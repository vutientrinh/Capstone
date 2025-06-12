package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.service.PostLikedService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostLikedController {

  private final PostLikedService postLikedService;

  public PostLikedController(PostLikedService postLikedService) {
    this.postLikedService = postLikedService;
  }

  @PostMapping("/{id}/like")
  public ResponseEntity<?> like(@PathVariable("id") UUID id) {
    UUID result = postLikedService.like(id);
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/{id}/unlike")
  public ResponseEntity<?> unlike(@PathVariable("id") UUID id) {
    Boolean success = postLikedService.unlike(id);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/{id}/liked-users")
  public ResponseEntity<?> getLikedUsers(@PathVariable("id") UUID id) {
    List<?> lstUsers = postLikedService.getLikedUsers(id);
    if (lstUsers != null && !lstUsers.isEmpty()) {
      return ResponseEntity.ok(DataResponse.builder().data(lstUsers).build());
    }

    // return 204 if no content
    return ResponseEntity.noContent().build();
  }
}
