package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.service.CommentLikedService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/comments")
public class CommentLikedController {
  private final CommentLikedService commentLikedService;

  public CommentLikedController(CommentLikedService commentLikedService) {
    this.commentLikedService = commentLikedService;
  }

  @PostMapping("/{id}/like")
  public ResponseEntity<?> likeAPI(@PathVariable("id") UUID commentId) {
    Boolean result = commentLikedService.like(commentId);
    if (result) {
      return ResponseEntity.ok().body(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/{id}/unlike")
  public ResponseEntity<?> unlikeAPI(@PathVariable("id") UUID commentId) {
    Boolean result = commentLikedService.unlike(commentId);
    if (result) {
      return ResponseEntity.ok().body(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/{id}/liked-users")
  public ResponseEntity<?> getLikedUsersAPI(
      @PathVariable("id") UUID commentId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok()
        .body(
            DataResponse.builder()
                .data(commentLikedService.getLikedUsers(commentId, page, size))
                .build());
  }
}
