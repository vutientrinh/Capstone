package com.satvik.satchat.payload.post;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequest {

  @NotBlank(message = "CONTENT_LENGTH_INVALID")
  private String content;

  private List<MultipartFile> images;
  private UUID authorId;
  private UUID topicId;
}
