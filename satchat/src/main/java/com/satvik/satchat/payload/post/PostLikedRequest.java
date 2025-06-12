package com.satvik.satchat.payload.post;

import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostLikedRequest {
  private UUID authorId;
  private UUID postId;
}
