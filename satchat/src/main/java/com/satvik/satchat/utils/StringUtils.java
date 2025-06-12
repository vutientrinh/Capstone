package com.satvik.satchat.utils;

import java.util.HashMap;
import java.util.Map;

public class StringUtils {

  /**
   * Input: "{key1=value1, key2=value2, key3=value3}" Output: Map<String, Object>: {key1=value1,
   * key2=value2, key3=value3}
   */
  public static Map<String, Object> convertStringToMap(String str) {
    Map<String, Object> map = new HashMap<>();
    String[] pairs = str.split(", ");

    for (String pair : pairs) {
      String[] keyValue = pair.split("=");
      if (keyValue.length == 2) {
        String key = keyValue[0].trim();
        String value = keyValue[1].trim();
        map.put(key, value);
      }
    }
    return map;
  }
}
