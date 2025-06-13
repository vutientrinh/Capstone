package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class User implements Serializable {
  private UUID id;

  @JsonProperty("created_at")
  private String createdAt;

  @JsonProperty("updated_at")
  private String updatedAt;

  private String avatar;
  private String bio;
  private String cover;
  private String email;

  @JsonProperty("first_name")
  private String firstName;

  @JsonProperty("follower_count")
  private Integer followerCount;

  @JsonProperty("last_name")
  private String lastName;

  private String password;

  @JsonProperty("post_count")
  private Integer postCount;

  private int status;
  private String username;

  @JsonProperty("website_url")
  private String websiteUrl;

  @JsonProperty("friends_count")
  private Integer friendsCount;

  public String toJson() {
    return String.format(
        "{\"id\":\"%s\",\"created_at\":\"%s\",\"updated_at\":\"%s\",\"avatar\":\"%s\",\"bio\":\"%s\",\"cover\":\"%s\",\"email\":\"%s\",\"first_name\":\"%s\",\"follower_count\":%d,\"last_name\":\"%s\",\"password\":\"%s\",\"post_count\":%d,\"status\":%d,\"username\":\"%s\",\"website_url\":\"%s\",\"friends_count\":%d}",
        id,
        createdAt,
        updatedAt,
        avatar,
        bio,
        cover,
        email,
        firstName,
        followerCount,
        lastName,
        password,
        postCount,
        status,
        username,
        websiteUrl,
        friendsCount);
  }
}
