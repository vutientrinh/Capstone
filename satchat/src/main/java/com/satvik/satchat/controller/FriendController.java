package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.user.FriendRequest;
import com.satvik.satchat.service.FriendService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/users")
public class FriendController {
  private final FriendService friendService;

  public FriendController(FriendService friendService) {
    this.friendService = friendService;
  }

  @PostMapping("/create-request")
  public ResponseEntity<?> addFriend(@RequestBody FriendRequest friendRequest) {
    UUID result =
        friendService.addFriend(friendRequest.getRequesterId(), friendRequest.getReceiverId());
    if (result != null) {
      return ResponseEntity.ok(DataResponse.builder().data(result).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/{id}/accept-friend")
  public ResponseEntity<?> acceptFriend(@PathVariable("id") UUID id) {
    Boolean result = friendService.acceptFriend(id);
    if (result) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/{id}/delete-friend")
  public ResponseEntity<?> deleteFriend(@PathVariable("id") UUID id) {
    Boolean result = friendService.removeFriend(id);
    if (result) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @GetMapping("/{userId}/get-friends")
  public ResponseEntity<?> getFriends(
      @PathVariable("userId") UUID userId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder().data(friendService.getAllFriends(userId, page, size)).build());
  }

  @GetMapping("/{userId}/get-friends-request")
  public ResponseEntity<?> getFriendRequests(
      @PathVariable("userId") UUID userId,
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder()
            .data(friendService.getAllFriendRequests(userId, page, size))
            .build());
  }
}
