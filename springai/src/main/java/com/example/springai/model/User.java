package com.example.springai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

  @Id
  @Column(name = "id", columnDefinition = "char(36)")
  private String id;

  @Column(name = "created_at")
  @JsonProperty("created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  @JsonProperty("updated_at")
  private LocalDateTime updatedAt;

  private String avatar;

  private String bio;

  private String cover;

  private String email;

  @Column(name = "first_name")
  @JsonProperty("first_name")
  private String firstName;

  @Column(name = "follower_count")
  @JsonProperty("follower_count")
  private Integer followerCount;

  @Column(name = "last_name")
  @JsonProperty("last_name")
  private String lastName;

  private String password;

  @Column(name = "post_count")
  @JsonProperty("post_count")
  private Integer postCount;

  @Column(columnDefinition = "TINYINT")
  private Integer status;

  @Column(length = 100)
  private String username;

  @Column(name = "website_url")
  @JsonProperty("website_url")
  private String websiteUrl;

  @Column(name = "friends_count")
  @JsonProperty("friends_count")
  private Integer friendsCount;
}
