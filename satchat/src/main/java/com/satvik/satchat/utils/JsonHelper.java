package com.satvik.satchat.utils;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class JsonHelper {
  public static String extractValue(String input, String key) {
    String pattern = key + "=([^,}]+)";

    java.util.regex.Pattern r = java.util.regex.Pattern.compile(pattern);
    java.util.regex.Matcher m = r.matcher(input);

    if (m.find()) {
      return m.group(1).trim();
    }

    return null;
  }

  public static List<UUID> extractUUIDs(String input) {
    input = input.replace("[", "").replace("]", "");
    String[] parts = input.split(",");
    List<UUID> uuids = new ArrayList<>();
    for (String part : parts) {
      String uuidString = part.trim();
      if (uuidString.length() == 36) {
        try {
          UUID uuid = UUID.fromString(uuidString);
          uuids.add(uuid);
        } catch (IllegalArgumentException e) {
          System.out.println("Invalid UUID: " + uuidString);
        }
      }
    }
    return uuids;
  }

  public static List<UUID> extractIds(String jsonResponse) {
    Gson gson = new Gson();
    JsonObject jsonObject = gson.fromJson(jsonResponse, JsonObject.class);
    JsonArray resultsArray = jsonObject.getAsJsonArray("results");
    String[] ids = new String[resultsArray.size()];
    for (int i = 0; i < resultsArray.size(); i++) {
      JsonObject result = resultsArray.get(i).getAsJsonObject();
      ids[i] = result.get("id").getAsString();
    }

    List<UUID> uuidList = new ArrayList<>();
    for (String id : ids) {
      try {
        UUID uuid = UUID.fromString(id);
        uuidList.add(uuid);
      } catch (IllegalArgumentException e) {
        System.out.println("Invalid UUID: " + id);
      }
    }
    return uuidList;
  }
}
