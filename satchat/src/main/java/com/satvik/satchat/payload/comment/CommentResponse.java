package com.satvik.satchat.payload.comment;

import com.satvik.satchat.model.Enum.EComment;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
  private UUID id;
  private UUID authorId;
  private UUID postId;
  private String content;
  private author author;
  @Builder.Default private Integer likedCount = 0;
  @Builder.Default private EComment status = EComment.APPROVED;

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class author {
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String avatar;
  }
}
