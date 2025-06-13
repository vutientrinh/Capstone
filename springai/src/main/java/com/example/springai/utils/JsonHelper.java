package com.example.springai.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JsonHelper {
  public static String[] extractKeywords(String jsonResponse) throws Exception {
    try {
      // pre-process the JSON response
      jsonResponse = jsonResponse.replace("=", ":");
      jsonResponse = jsonResponse.replace("```json\n", "").replace("\n```", "").trim();
      log.info("jsonResponse: {}", jsonResponse);

      String pattern = "text:\\s*\\[(.*?)\\]";
      java.util.regex.Pattern r = java.util.regex.Pattern.compile(pattern);
      java.util.regex.Matcher m = r.matcher(jsonResponse);

      if (m.find()) {
        String arrayContent = m.group(1).trim();
        if (arrayContent.endsWith("\"")) {
          int lastValidCommaIndex = arrayContent.lastIndexOf(",");
          if (lastValidCommaIndex != -1) {
            arrayContent = arrayContent.substring(0, lastValidCommaIndex);
          }
        }

        String[] items = arrayContent.split("\",\\s*\"");
        for (int i = 0; i < items.length; i++) {
          items[i] = items[i].replace("\"", "").trim();
        }

        return items;
      }

      return new String[0];
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Error parsing JSON response: " + e.getMessage());
    }
  }

  public static String getResponse(String jsonResponse) {
    try {
      // pre-process the JSON response
      jsonResponse = jsonResponse.replace("=", ":");
      jsonResponse = jsonResponse.replace("```json\n", "").replace("\n```", "").trim();

      // Replace escaped quotes with a temporary marker
      String tempMarker = "##QUOTE##";
      jsonResponse = jsonResponse.replace("\\\"", tempMarker);

      log.info("jsonResponse after quote replacement: {}", jsonResponse);

      // Use your existing regex pattern
      String pattern = "\"text\":\\s*\"(.*?)\"";
      java.util.regex.Pattern r =
          java.util.regex.Pattern.compile(pattern, java.util.regex.Pattern.DOTALL);
      java.util.regex.Matcher m = r.matcher(jsonResponse);

      if (m.find()) {
        // Extract the matched content
        String textContent = m.group(1);

        // Replace the temporary marker back to quotes
        textContent = textContent.replace(tempMarker, "\"");

        // Replace other escaped characters if needed
        textContent = textContent.replace("\\n", "\n").replace("\\\\", "\\");

        return textContent;
      } else {
        log.error("Could not find text content in JSON response");
        return "";
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Error parsing JSON response: " + e.getMessage());
    }
  }
}
