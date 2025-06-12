package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.comment.CommentCreationRequest;
import com.satvik.satchat.payload.comment.CommentResponse;
import com.satvik.satchat.payload.comment.CommentUpdateRequest;
import com.satvik.satchat.service.CommentService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/comments")
public class CommentController {
  private final CommentService commentService;

  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  @GetMapping
  public ResponseEntity<?> getCommentsAPI(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder().data(commentService.getComments(page, size)).build());
  }

  @GetMapping("/{uuid}")
  public ResponseEntity<?> getCommentAPI(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @PathVariable("uuid") UUID uuid) {
    return ResponseEntity.ok(
        DataResponse.builder().data(commentService.getCommentByPost(page, size, uuid)).build());
  }

  @PostMapping("/create")
  public ResponseEntity<?> createCommentAPI(@Valid @RequestBody CommentCreationRequest request) {
    CommentResponse result = commentService.create(request);
    if (result != null) {
      return ResponseEntity.ok().body(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping("/{uuid}")
  public ResponseEntity<?> updateCommentAPI(
      @PathVariable("uuid") UUID uuid, @Valid @RequestBody CommentUpdateRequest request) {
    Boolean success = commentService.update(uuid, request);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<?> deleteCommentAPI(@PathVariable("uuid") UUID uuid) {
    Boolean success = commentService.delete(uuid);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/{uuid}/status")
  public ResponseEntity<?> updateCommentStatusAPI(
      @PathVariable("uuid") UUID uuid, @RequestParam("status") String status) {
    Boolean success = commentService.setCommentStatus(uuid, status);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }
}
