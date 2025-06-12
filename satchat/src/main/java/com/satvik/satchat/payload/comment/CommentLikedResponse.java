package com.satvik.satchat.payload.comment;

import com.satvik.satchat.model.Enum.EComment;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentLikedResponse {
  private UUID id;
  private UUID authorId;
  private UUID postId;
  private String content;
  private CommentResponse.author author;
  @Builder.Default private Integer likedCount = 0;
  @Builder.Default private Boolean hasLiked = false;
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
