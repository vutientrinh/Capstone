package com.satvik.satchat.utils;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.config.minio.MinioConfig;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.repository.FileRepository;
import io.minio.*;
import io.minio.http.Method;
import io.minio.messages.Bucket;
import io.minio.messages.DeleteError;
import io.minio.messages.DeleteObject;
import io.minio.messages.Item;
import jakarta.transaction.Transactional;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
public class MinioUtil {

  private final MinioClient minioClient;
  private final MinioConfig minioConfig;
  private final S3BucketValidator s3BucketValidator;
  private final FileRepository fileRepository;

  public MinioUtil(
      MinioClient minioClient,
      MinioConfig minioConfig,
      S3BucketValidator s3BucketValidator,
      FileRepository fileRepository) {
    this.minioClient = minioClient;
    this.minioConfig = minioConfig;
    this.s3BucketValidator = s3BucketValidator;
    this.fileRepository = fileRepository;
  }

  // Upload Files
  @SneakyThrows
  public void putObject(
      String bucketName, MultipartFile multipartFile, String filename, String fileType) {
    InputStream inputStream = new ByteArrayInputStream(multipartFile.getBytes());
    minioClient.putObject(
        PutObjectArgs.builder().bucket(bucketName).object(filename).stream(
                inputStream, -1, minioConfig.getFileSize())
            .contentType(fileType)
            .build());
  }

  // Check if bucket name exists
  @SneakyThrows
  public boolean bucketExists(String bucketName) {
    // check style name follow S3
    s3BucketValidator.isValidBucketName(bucketName);
    boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
    if (found) {
      log.info("MinioUtil | bucketExists | message : " + bucketName + " exists");
    } else {
      log.info("MinioUtil | bucketExists | message : " + bucketName + " does not exist");
    }
    return found;
  }

  // Create bucket name
  @SneakyThrows
  @Transactional
  public boolean makeBucket(String bucketName) {

    boolean flag = bucketExists(bucketName);
    if (!flag) {
      minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
      return true;
    } else {
      return false;
    }
  }

  // List all buckets
  @SneakyThrows
  public List<Bucket> listBuckets() {
    return minioClient.listBuckets();
  }

  // List all bucket names
  @SneakyThrows
  public List<String> listBucketNames() {
    List<Bucket> bucketList = listBuckets();
    List<String> bucketListName = new ArrayList<>();

    for (Bucket bucket : bucketList) {
      bucketListName.add(bucket.name());
    }
    return bucketListName;
  }

  // List all objects from the specified bucket
  @SneakyThrows
  public Iterable<Result<Item>> listObjects(String bucketName) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      return minioClient.listObjects(ListObjectsArgs.builder().bucket(bucketName).build());
    }
    return null;
  }

  // Delete Bucket by its name from the specified bucket
  @SneakyThrows
  @Transactional
  public boolean removeBucket(String bucketName) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      Iterable<Result<Item>> myObjects = listObjects(bucketName);

      for (Result<Item> result : myObjects) {
        Item item = result.get();
        if (item.size() > 0) {
          return false;
        }
      }

      //  Delete bucket when bucket is empty
      minioClient.removeBucket(RemoveBucketArgs.builder().bucket(bucketName).build());
      flag = bucketExists(bucketName);
      return !flag;
    }
    return false;
  }

  // List all object names from the specified bucket
  @SneakyThrows
  public List<String> listObjectNames(String bucketName) {
    List<String> listObjectNames = new ArrayList<>();
    boolean flag = bucketExists(bucketName);
    if (flag) {
      Iterable<Result<Item>> myObjects = listObjects(bucketName);
      for (Result<Item> result : myObjects) {
        Item item = result.get();
        listObjectNames.add(item.objectName());
      }
    } else {
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
      //            listObjectNames.add(" Bucket does not exist ");
    }
    return listObjectNames;
  }

  // Delete object from the specified bucket
  @SneakyThrows
  @Transactional
  public boolean removeObject(String bucketName, String objectName) {

    boolean flag = bucketExists(bucketName);
    if (flag) {
      minioClient.removeObject(
          RemoveObjectArgs.builder().bucket(bucketName).object(objectName).build());
      return true;
    }
    return false;
  }

  // Get file path from the specified bucket
  @SneakyThrows
  public String getObjectUrl(String bucketName, String objectName) {
    boolean flag = bucketExists(bucketName);
    String url = "";

    if (flag) {
      url =
          minioClient.getPresignedObjectUrl(
              GetPresignedObjectUrlArgs.builder()
                  .method(Method.GET)
                  .bucket(bucketName)
                  .object(objectName)
                  .expiry((int) Duration.ofMinutes(2).getSeconds())
                  .build());
    }
    return url;
  }

  // Get metadata of the object from the specified bucket
  @SneakyThrows
  public StatObjectResponse statObject(String bucketName, String objectName) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      StatObjectResponse stat =
          minioClient.statObject(
              StatObjectArgs.builder().bucket(bucketName).object(objectName).build());
      return stat;
    }
    return null;
  }

  // Get a file object as a stream from the specified bucket
  @SneakyThrows
  public InputStream getObject(String bucketName, String objectName) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      StatObjectResponse statObject = statObject(bucketName, objectName);
      if (statObject != null && statObject.size() > 0) {
        InputStream stream =
            minioClient.getObject(
                GetObjectArgs.builder().bucket(bucketName).object(objectName).build());
        return stream;
      }
    }
    return null;
  }

  // Get a file object as a stream from the specified bucket （ Breakpoint download )
  @SneakyThrows
  public InputStream getObject(String bucketName, String objectName, long offset, Long length) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      StatObjectResponse statObject = statObject(bucketName, objectName);
      if (statObject != null && statObject.size() > 0) {
        InputStream stream =
            minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .offset(offset)
                    .length(length)
                    .build());
        return stream;
      }
    }
    return null;
  }

  // Delete multiple file objects from the specified bucket
  @SneakyThrows
  @Transactional
  public boolean removeObject(String bucketName, List<String> objectNames) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      List<DeleteObject> objects = new LinkedList<>();
      for (int i = 0; i < objectNames.size(); i++) {
        fileRepository
            .findByFilename(objectNames.get(i))
            .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));
        objects.add(new DeleteObject(objectNames.get(i)));
      }
      // delete objects in Database
      objectNames.stream().forEach(objectName -> fileRepository.deleteFileByFileName(objectName));
      Iterable<Result<DeleteError>> results =
          minioClient.removeObjects(
              RemoveObjectsArgs.builder().bucket(bucketName).objects(objects).build());

      for (Result<DeleteError> result : results) {
        DeleteError error = result.get();
        log.info("RemoveObject: " + error.message());
        return false;
      }
    }
    return true;
  }

  // Upload InputStream object to the specified bucket
  @SneakyThrows
  @Transactional
  public boolean putObject(
      String bucketName, String objectName, InputStream inputStream, String contentType) {
    boolean flag = bucketExists(bucketName);
    if (flag) {
      minioClient.putObject(
          PutObjectArgs.builder().bucket(bucketName).object(objectName).stream(
                  inputStream, -1, minioConfig.getFileSize())
              .contentType(contentType)
              .build());
      StatObjectResponse statObject = statObject(bucketName, objectName);
      return statObject != null && statObject.size() > 0;
    }
    return false;
  }
}
