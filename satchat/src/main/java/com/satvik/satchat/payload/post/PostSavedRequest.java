package com.satvik.satchat.payload.post;

import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSavedRequest {
  UUID authorId;
  UUID postId;
}
