package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.mapper.FollowMapper;
import com.satvik.satchat.service.FollowService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/users")
public class FollowController {
  private final FollowService followService;
  private final FollowMapper followMapper;

  public FollowController(FollowService followService, FollowMapper followMapper) {
    this.followService = followService;
    this.followMapper = followMapper;
  }

  @PostMapping("/{userId}/follow")
  public ResponseEntity<?> follow(@PathVariable("userId") UUID userId) {
    Boolean success = followService.follow(userId);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/{userId}/unfollow")
  public ResponseEntity<?> unfollow(@PathVariable("userId") UUID userId) {
    Boolean success = followService.unfollow(userId);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/{userId}/followers")
  public ResponseEntity<?> getFollowers(
      @PathVariable("userId") UUID userId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder().data(followService.listFollowers(userId, page, size)).build());
  }

  @GetMapping("/{userId}/followings")
  public ResponseEntity<?> getFollowings(
      @PathVariable("userId") UUID userId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder().data(followService.listFollowings(userId, page, size)).build());
  }
}
