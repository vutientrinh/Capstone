package com.satvik.satchat.payload.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExtendedUserProfileResponse extends UserProfileResponse {
  private Boolean isFollowed;
}
