package com.satvik.satchat.payload.comment;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentCreationRequest {

  UUID postId;

  @NotBlank(message = "CONTENT_LENGTH_INVALID")
  String content;
}
