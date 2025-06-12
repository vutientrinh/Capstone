package com.satvik.satchat.utils;

import com.satvik.satchat.entity.UserEntity;

public class DbUtils {
  private DbUtils() {}

  public static String getConvId(UserEntity user1, UserEntity user2) {
    String id1 = user1.getId().toString();
    String id2 = user2.getId().toString();

    return id1.compareTo(id2) > 0 ? id2 + "_" + id1 : id1 + "_" + id2;
  }
}
