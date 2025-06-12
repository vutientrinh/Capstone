package com.satvik.satchat.payload.post;

import java.util.List;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

  private UUID id;
  private String content;
  private List<String> images;
  private UUID authorId;
  private UUID topicId;
  private Integer commentCount;
  private Integer likedCount;
  private String type;
  private String status;
  private String postStatus;
  private String createdAt;
  private String updatedAt;
  private topic topic;
  private author author;

  @Builder.Default private Boolean hasLiked = false;

  @Builder.Default private Boolean hasSaved = false;

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class topic {
    private String id;
    private String name;
    private Integer postCount;
    private String color;
  }

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
