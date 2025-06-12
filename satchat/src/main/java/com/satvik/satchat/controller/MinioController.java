package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.payload.file.FileResponse;
import com.satvik.satchat.service.MinioService;
import com.satvik.satchat.utils.FileTypeUtils;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/minio")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MinioController {

  private final MinioService minioService;

  @Value("${server.port}")
  private int portNumber;

  public MinioController(MinioService minioService) {
    this.minioService = minioService;
  }

  @GetMapping
  public String getMinio() {
    return "Test server is running...";
  }

  @PostMapping(value = "/upload", consumes = "multipart/form-data")
  @PreAuthorize("hasAuthority('ROLE_USER') OR hasAnyAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> uploadFile(
      @RequestParam("file") MultipartFile file, @RequestParam("bucketName") String bucketName) {
    String fileType = "";
    if (file != null && !file.isEmpty() && !bucketName.isBlank()) {
      fileType = FileTypeUtils.getFileType(file);
    }

    // Upload file to S3
    if (fileType != null) {
      FileResponse response = minioService.putObject(file, bucketName, fileType);
      if (response != null) {
        return ResponseEntity.ok(DataResponse.builder().data(response).build());
      }
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PostMapping("/addBucket/{bucketName}")
  @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
  public String addBucket(@PathVariable String bucketName) {
    minioService.makeBucket(bucketName);
    return "Bucket name " + bucketName + " created";
  }

  @GetMapping("/show/{bucketName}")
  @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
  public List<String> show(@PathVariable String bucketName) {
    return minioService.listObjectNames(bucketName);
  }

  @GetMapping("/showBucketName")
  @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
  public List<String> showBucketName() {
    return minioService.listBucketName();
  }

  @DeleteMapping("/removeBucket/{bucketName}")
  @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
  public ResponseEntity<?> delBucketName(@PathVariable("bucketName") String bucketName) {
    boolean state = minioService.removeBucket(bucketName);
    if (state) {
      return ResponseEntity.ok().body(DataResponse.builder().data(true).build());
    } else {
      return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
    }
  }

  @DeleteMapping("/removeObject/{bucketName}/{objectName}")
  public ResponseEntity<?> delObject(
      @PathVariable("bucketName") String bucketName,
      @PathVariable("objectName") String objectName) {

    boolean state = minioService.removeObject(bucketName, objectName);
    if (state) {
      return ResponseEntity.ok().body(DataResponse.builder().data(true).build());
    } else {
      return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
    }
  }

  @DeleteMapping("/removeListObject/{bucketName}")
  public ResponseEntity<?> delListObject(
      @PathVariable("bucketName") String bucketName, @RequestBody List<String> objectNameList) {

    boolean state = minioService.removeListObject(bucketName, objectNameList);
    if (state) {
      return ResponseEntity.ok().body(DataResponse.builder().data(true).build());
    } else {
      return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
    }
  }

  @GetMapping("/showListObjectNameAndDownloadUrl/{bucketName}")
  public Map<String, String> showListObjectNameAndDownloadUrl(@PathVariable String bucketName) {

    Map<String, String> map = new HashMap<>();
    List<String> listObjectNames = minioService.listObjectNames(bucketName);
    String url = "http://localhost:" + portNumber + "/minio/download/" + bucketName + "/";
    for (int i = 0; i < listObjectNames.size(); i++) {
      map.put(listObjectNames.get(i), url + listObjectNames.get(i));
    }
    return map;
  }

  @GetMapping("/download/{bucketName}/{objectName}")
  public void download(
      HttpServletResponse response,
      @PathVariable("bucketName") String bucketName,
      @PathVariable("objectName") String objectName) {

    InputStream in = null;
    try {
      in = minioService.downloadObject(bucketName, objectName);
      response.setHeader(
          "Content-Disposition", "attachment;filename=" + URLEncoder.encode(objectName, "UTF-8"));
      response.setCharacterEncoding("UTF-8");
      // Remove bytes from InputStream Copied to the OutputStream .
      IOUtils.copy(in, response.getOutputStream());
    } catch (UnsupportedEncodingException e) {
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    } catch (IOException e) {
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    } finally {
      if (in != null) {
        try {
          in.close();
        } catch (IOException e) {
          throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
      }
    }
  }
}
