package com.satvik.satchat.config.minio;

import io.minio.MinioClient;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class MinioConfig {

  @Value("${minio.endpoint}")
  private String endpoint;

  @Value("${minio.port}")
  private Integer port;

  @Value("${minio.accessKey}")
  private String accessKey;

  @Value("${minio.secretKey}")
  private String secretKey;

  @Value("${minio.secure}")
  private boolean secure;

  @Value("${minio.bucket-name}")
  private String bucketName;

  @Value("${minio.image-size}")
  private long imageSize;

  @Value("${minio.file-size}")
  private long fileSize;

  @Bean
  public MinioClient minioClient() {
    MinioClient minioClient =
        MinioClient.builder()
            .credentials(accessKey, secretKey)
            .endpoint(endpoint, port, secure)
            .build();
    return minioClient;
  }
}
