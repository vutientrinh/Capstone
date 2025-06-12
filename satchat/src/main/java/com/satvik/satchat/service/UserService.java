package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.model.Enum.EStatus;
import com.satvik.satchat.payload.file.FileResponse;
import com.satvik.satchat.payload.user.ExtendedUserProfileResponse;
import com.satvik.satchat.payload.user.UpdatePasswordRequest;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.payload.user.UserUpdateRequest;
import com.satvik.satchat.repository.FileRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.FileTypeUtils;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class UserService {
  @Value("${minio.accessURL}")
  private String minioAccessUrl;

  @Value("${frontend.url}")
  private String frontendUrl;

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final JwtUtils jwtUtils;
  private final PasswordEncoder encoder;
  private final MinioService minioService;
  private final FileRepository fileRepository;
  private final EmailService emailService;
  private final FollowService followService;

  @Autowired
  public UserService(
      UserRepository userRepository,
      UserMapper userMapper,
      JwtUtils jwtUtils,
      PasswordEncoder encoder,
      MinioService minioService,
      FileRepository fileRepository,
      EmailService emailService,
      FollowService followService) {
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.jwtUtils = jwtUtils;
    this.encoder = encoder;
    this.minioService = minioService;
    this.fileRepository = fileRepository;
    this.emailService = emailService;
    this.followService = followService;
  }

  public UserProfileResponse getProfileByToken() {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    return userMapper.map(currentUser, UserProfileResponse.class);
  }

  public UserProfileResponse getProfileById(UUID id) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Get user profile by id: {}", id);
    UserEntity user =
        userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    Boolean isFollowed = false;
    if (!currentUser.getId().equals(id)) {
      isFollowed = followService.hasFollowed(id);
    }

    UserProfileResponse base = userMapper.map(user, UserProfileResponse.class);
    ExtendedUserProfileResponse response = new ExtendedUserProfileResponse();
    BeanUtils.copyProperties(base, response);
    response.setIsFollowed(isFollowed);
    return response;
  }

  public UserProfileResponse getProfileByUserName(String username) {
    log.info("Get user profile by username: {}", username);
    UserEntity user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    return userMapper.map(user, UserProfileResponse.class);
  }

  @Transactional
  public Boolean updateProfile(UserUpdateRequest request) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (EStatus.BANNED.equals(currentUser.getStatus())
        || EStatus.DELETED.equals(currentUser.getStatus())) {
      throw new AppException(ErrorCode.USER_NOT_ALLOWED);
    }

    userRepository.updateUser(
        currentUser.getId(),
        request.getAvatar(),
        request.getCover(),
        request.getFirstName(),
        request.getLastName(),
        request.getBio(),
        request.getWebsiteUrl());

    UserEntity updatedUser =
        userRepository
            .findById(currentUser.getId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED_AFTER_UPDATE));

    if (EStatus.BANNED.equals(updatedUser.getStatus())
        || EStatus.DELETED.equals(updatedUser.getStatus())) {
      throw new AppException(ErrorCode.USER_STATUS_CHANGED_INVALID);
    }
    return true;
  }

  @Transactional
  public Boolean deleteProfile(String id) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);
    UserEntity administrator =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Delete user profile by id: {}", id);
    UserEntity user =
        userRepository
            .findById(UUID.fromString(id))
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (EStatus.BANNED.equals(administrator.getStatus())
        || EStatus.DELETED.equals(administrator.getStatus())) {
      throw new AppException(ErrorCode.USER_NOT_ALLOWED);
    }

    userRepository.updateUserStatus(user.getId(), EStatus.DELETED);
    UserEntity updatedUser =
        userRepository
            .findById(user.getId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED_AFTER_UPDATE));

    if (!EStatus.DELETED.equals(updatedUser.getStatus())) {
      throw new AppException(ErrorCode.USER_STATUS_CHANGED_INVALID);
    }

    return true;
  }

  @Transactional
  public Boolean updatePassword(UpdatePasswordRequest request) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    log.info("Update password for user: {}", currentUser.getId());
    if (!jwtUtils.matches(request.getCurrentPassword(), currentUser.getPassword())) {
      throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
    }
    userRepository.updatePassword(currentUser.getId(), encoder.encode(request.getNewPassword()));
    userRepository
        .findById(currentUser.getId())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED_AFTER_UPDATE));

    return true;
  }

  public PageResponse<UserProfileResponse> getAllUsers(int page, int size) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var users = userRepository.findAllUsers(pageable);

    return PageResponse.<UserProfileResponse>builder()
        .currentPage(page)
        .pageSize(users.getSize())
        .totalPages(users.getTotalPages())
        .totalElements(users.getTotalElements())
        .data(
            users.getContent().stream()
                .map(item -> userMapper.map(item, UserProfileResponse.class))
                .toList())
        .build();
  }

  public PageResponse<UserProfileResponse> getSuggestedFriends(int page, int size) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var users = userRepository.getUsersNotFriendsWith(currentUser.getId(), pageable);

    return PageResponse.<UserProfileResponse>builder()
        .currentPage(page)
        .pageSize(users.getSize())
        .totalPages(users.getTotalPages())
        .totalElements(users.getTotalElements())
        .data(
            users.getContent().stream()
                .map(item -> userMapper.map(item, UserProfileResponse.class))
                .toList())
        .build();
  }

  @Transactional
  public Boolean updateUserAvatar(MultipartFile file) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (EStatus.BANNED.equals(currentUser.getStatus())
        || EStatus.DELETED.equals(currentUser.getStatus())) {
      throw new AppException(ErrorCode.USER_NOT_ALLOWED);
    }

    // update avatar and save to database
    if (file != null) {
      String fileType = "";
      if (file != null && !file.isEmpty()) {
        fileType = FileTypeUtils.getFileType(file);
      }

      FileResponse object = minioService.putObject(file, "commons", fileType);
      FileEntity entity =
          fileRepository
              .findByFilename(object.getFilename())
              .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));

      userRepository.updateUserAvatar(currentUser.getId(), entity.getFilename());
    }

    userRepository
        .findById(currentUser.getId())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED_AFTER_UPDATE));

    return true;
  }

  @Transactional
  public Boolean updateUserCover(MultipartFile file) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (EStatus.BANNED.equals(currentUser.getStatus())
        || EStatus.DELETED.equals(currentUser.getStatus())) {
      throw new AppException(ErrorCode.USER_NOT_ALLOWED);
    }

    // update avatar and save to database
    if (file != null) {
      String fileType = "";
      if (file != null && !file.isEmpty()) {
        fileType = FileTypeUtils.getFileType(file);
      }

      FileResponse object = minioService.putObject(file, "commons", fileType);
      FileEntity entity =
          fileRepository
              .findByFilename(object.getFilename())
              .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));

      userRepository.updateUserCover(currentUser.getId(), entity.getFilename());
    }

    userRepository
        .findById(currentUser.getId())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED_AFTER_UPDATE));

    return true;
  }

  public Boolean sendPasswordRecoveryEmail(String email) throws MessagingException {
    UserEntity user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    String newPwd = jwtUtils.generateRandomPassword(12);
    String encodedPwd = encoder.encode(newPwd);
    log.info("New password: {}", newPwd);
    userRepository.updatePassword(user.getId(), encodedPwd);
    emailService.sendNewPasswordEmail(email, user.getUsername(), newPwd);
    return true;
  }
}
