package com.example.springai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

  @Id
  @Column(name = "id", columnDefinition = "char(36)")
  private String id;

  @Column(name = "created_at")
  @JsonProperty("created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  @JsonProperty("updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "comment_count")
  @JsonProperty("comment_count")
  private Integer commentCount;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  private String images;

  @Column(name = "liked_count")
  @JsonProperty("liked_count")
  private Integer likedCount;

  private Integer status;

  private Integer type;

  @Column(name = "author", columnDefinition = "char(36)")
  private String author;

  @Column(name = "topic", columnDefinition = "char(36)")
  private String topic;

  @JsonProperty("post_status")
  private Integer postStatus;
}
