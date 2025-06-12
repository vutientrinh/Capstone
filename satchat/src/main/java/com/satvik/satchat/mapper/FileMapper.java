package com.satvik.satchat.mapper;

import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import com.satvik.satchat.payload.file.FileResponse;
import java.time.Instant;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FileMapper {
  private final ModelMapper mapper = new ModelMapper();

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }

  public FileResponse toFileResponse(FileEntity fileEntity) {
    return FileResponse.builder()
        .filename(fileEntity.getFilename())
        .contentType(fileEntity.getContentType())
        .fileSize(fileEntity.getFileSize())
        .createdAt(Instant.now().toString())
        .build();
  }
}
