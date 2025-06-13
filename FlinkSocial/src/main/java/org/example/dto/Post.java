package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Post implements Serializable {

  private UUID id;

  @JsonProperty("created_at")
  private String createdAt;

  @JsonProperty("updated_at")
  private String updatedAt;

  @JsonProperty("comment_count")
  private Integer commentCount;

  private String content;

  private String images;

  @JsonProperty("liked_count")
  private Integer likedCount;

  private int status;

  private int type;

  private UUID author;

  private UUID topic;

  @JsonProperty("post_status")
  private int postStatus;

  public String toJson() {
    return String.format(
        "{\"id\":\"%s\",\"created_at\":\"%s\",\"updated_at\":\"%s\",\"comment_count\":%d,\"content\":\"%s\",\"images\":\"%s\",\"liked_count\":%d,\"status\":%d,\"type\":%d,\"author\":\"%s\",\"topic\":\"%s\",\"post_status\":%d}",
        id,
        createdAt,
        updatedAt,
        commentCount,
        content,
        images,
        likedCount,
        status,
        type,
        author,
        topic,
        postStatus);
  }
}
