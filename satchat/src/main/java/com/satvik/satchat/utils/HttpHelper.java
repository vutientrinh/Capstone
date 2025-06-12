package com.satvik.satchat.utils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpHelper {
  private static final HttpClient httpClient = HttpClient.newHttpClient();

  public static String postJson(String url, String jsonBody)
      throws IOException, InterruptedException {
    if (httpClient == null) {
      throw new IllegalStateException("HttpClient is not initialized");
    }

    HttpRequest request =
        HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println("Response body: " + response.body());
    return response.body();
  }

  public static String getJson(String url) throws IOException, InterruptedException {
    if (httpClient == null) {
      throw new IllegalStateException("HttpClient is not initialized");
    }

    HttpRequest request =
        HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Accept", "application/json")
            .GET()
            .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println("Response body: " + response.body());
    return response.body();
  }
}
