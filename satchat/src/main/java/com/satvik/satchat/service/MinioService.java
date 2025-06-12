package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.config.minio.MinioConfig;
import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.FileMapper;
import com.satvik.satchat.payload.file.FileResponse;
import com.satvik.satchat.repository.FileRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import com.satvik.satchat.utils.MinioUtil;
import io.minio.messages.Bucket;
import jakarta.transaction.Transactional;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class MinioService {

  private final MinioUtil minioUtil;
  private final MinioConfig minioProperties;
  private final FileRepository fileRepository;
  private final FileMapper fileMapper;
  private final UserRepository userRepository;
  private final JwtUtils jwtUtils;

  public MinioService(
      MinioUtil minioUtil,
      MinioConfig minioProperties,
      FileRepository fileRepository,
      FileMapper fileMapper,
      UserRepository userRepository,
      JwtUtils jwtUtils) {
    this.minioUtil = minioUtil;
    this.minioProperties = minioProperties;
    this.fileRepository = fileRepository;
    this.fileMapper = fileMapper;
    this.userRepository = userRepository;
    this.jwtUtils = jwtUtils;
  }

  public boolean bucketExists(String bucketName) {
    return minioUtil.bucketExists(bucketName);
  }

  public void makeBucket(String bucketName) {
    minioUtil.makeBucket(bucketName);
  }

  public List<String> listBucketName() {
    return minioUtil.listBucketNames();
  }

  public List<Bucket> listBuckets() {
    return minioUtil.listBuckets();
  }

  public boolean removeBucket(String bucketName) {
    return minioUtil.removeBucket(bucketName);
  }

  public List<String> listObjectNames(String bucketName) {
    return minioUtil.listObjectNames(bucketName);
  }

  @SneakyThrows
  @Transactional
  public FileResponse putObject(MultipartFile multipartFile, String bucketName, String fileType) {
    try {
      // credentials author
      UserEntity author = getCredentials();

      // Response
      bucketName =
          StringUtils.isNotBlank(bucketName) ? bucketName : minioProperties.getBucketName();
      if (!this.bucketExists(bucketName)) {
        this.makeBucket(bucketName);
      }

      String fileName = multipartFile.getOriginalFilename();
      Long fileSize = multipartFile.getSize();
      String objectName =
          UUID.randomUUID().toString().replaceAll("-", "")
              + fileName.substring(fileName.lastIndexOf("."));

      minioUtil.putObject(bucketName, multipartFile, objectName, fileType);
      FileEntity entity =
          FileEntity.builder()
              .id(UUID.randomUUID())
              .author(author)
              .filename(objectName)
              .contentType(fileType)
              .fileSize(fileSize)
              .build();
      fileRepository.save(entity);

      // Check if file is saved
      fileRepository
          .findById(entity.getId())
          .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));

      // Return
      return fileMapper.toFileResponse(entity);
    } catch (Exception e) {
      log.info("Exception : " + e.getMessage());
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
  }

  public InputStream downloadObject(String bucketName, String objectName) {
    return minioUtil.getObject(bucketName, objectName);
  }

  @Transactional
  public boolean removeObject(String bucketName, String objectName) {
    FileEntity file =
        fileRepository
            .findByFilename(objectName)
            .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));

    // if present in db, remove from minio
    fileRepository.delete(file);
    return minioUtil.removeObject(bucketName, objectName);
  }

  @Transactional
  public boolean removeListObject(String bucketName, List<String> objectNameList) {
    return minioUtil.removeObject(bucketName, objectNameList);
  }

  public String getObjectUrl(String bucketName, String objectName) {
    return minioUtil.getObjectUrl(bucketName, objectName);
  }

  // jwt credentials
  public UserEntity getCredentials() {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    return userRepository
        .findByUsername(userDetails.getUsername())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
  }
}
