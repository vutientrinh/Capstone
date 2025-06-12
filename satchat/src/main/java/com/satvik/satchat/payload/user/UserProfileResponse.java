package com.satvik.satchat.payload.user;

import java.util.Set;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
  private UUID id;
  private String cover;
  private String avatar;
  private String username;
  private String firstName;
  private String lastName;
  private Set<String> roles;
  private String bio;
  private String websiteUrl;
  private int followerCount;
  private int friendsCount;
  private int postCount;
  private String status;
  private String createdAt;
  private String updatedAt;
}
