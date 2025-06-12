package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.model.UserResponse;
import com.satvik.satchat.payload.user.UpdatePasswordRequest;
import com.satvik.satchat.payload.user.UserUpdateRequest;
import com.satvik.satchat.service.OnlineOfflineService;
import com.satvik.satchat.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {
  private final OnlineOfflineService onlineOfflineService;
  private final UserService userService;

  public UserController(OnlineOfflineService onlineOfflineService, UserService userService) {
    this.onlineOfflineService = onlineOfflineService;
    this.userService = userService;
  }

  @GetMapping("/online")
  @PreAuthorize("hasAuthority('ADMIN')")
  List<UserResponse> getOnlineUsers() {
    return onlineOfflineService.getOnlineUsers();
  }

  @GetMapping("/subscriptions")
  @PreAuthorize("hasAuthority('ADMIN')")
  Map<String, Set<String>> getSubscriptions() {
    return onlineOfflineService.getUserSubscribed();
  }

  @GetMapping("/all")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getAllUsers(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(userService.getAllUsers(page, size));
  }

  @GetMapping("/suggested")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getSuggestedUsers(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(userService.getSuggestedFriends(page, size));
  }

  @GetMapping("/profile")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getProfile() {
    return ResponseEntity.ok(DataResponse.builder().data(userService.getProfileByToken()).build());
  }

  @GetMapping("/profile/{id}")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getProfileById(@Valid @PathVariable UUID id) {
    return ResponseEntity.ok(DataResponse.builder().data(userService.getProfileById(id)).build());
  }

  @GetMapping("/profile/accounts/{username}")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> getProfileByUserName(
      @Valid @PathVariable(name = "username") String username) {
    return ResponseEntity.ok(
        DataResponse.builder().data(userService.getProfileByUserName(username)).build());
  }

  @PutMapping("/profile")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> updateProfileById(@Valid @RequestBody UserUpdateRequest request) {
    Boolean success = userService.updateProfile(request);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/profile/{id}")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> updateProfileById(@Valid @PathVariable String id) {
    Boolean success = userService.deleteProfile(id);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping("/change-password")
  @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> updatePasswordById(@Valid @RequestBody UpdatePasswordRequest request) {
    Boolean success = userService.updatePassword(request);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping(value = "/update-avatar", consumes = "multipart/form-data")
  public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file) {
    Boolean success = userService.updateUserAvatar(file);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping(value = "/update-cover", consumes = "multipart/form-data")
  public ResponseEntity<?> updateCover(@RequestParam("file") MultipartFile file) {
    Boolean success = userService.updateUserCover(file);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }
}
