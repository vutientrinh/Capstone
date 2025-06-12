package com.satvik.satchat.payload.post;

import com.satvik.satchat.model.Enum.EPostStatus;
import com.satvik.satchat.model.Enum.EPostType;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateRequest {

  @NotBlank(message = "CONTENT_LENGTH_INVALID")
  private String content;

  private List<MultipartFile> images;

  private UUID topicId;

  private EPostStatus status;

  private EPostType type;
}
