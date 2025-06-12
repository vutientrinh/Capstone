package com.satvik.satchat.payload.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentUpdateRequest {

  @NotBlank(message = "CONTENT_LENGTH_INVALID")
  String content;
}
