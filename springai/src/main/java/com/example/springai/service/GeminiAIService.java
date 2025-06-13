package com.example.springai.service;

import com.example.springai.dto.Prompt;
import com.example.springai.utils.JsonHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiAIService {

  private final RestTemplate restTemplate;

  @Value("${gemini.api.url}")
  private String apiUrl;

  private final JsonHelper jsonHelper = new JsonHelper();

  public GeminiAIService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  public Object callGemini(Prompt prompt) throws Exception {

    HttpEntity<Prompt> requestEntity = new HttpEntity<>(prompt);

    ResponseEntity<Object> response =
        restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, Object.class);
    return JsonHelper.extractKeywords(response.getBody().toString());
  }

  public String getResponseFromGemini(Prompt prompt) throws Exception {
    HttpEntity<Prompt> requestEntity = new HttpEntity<>(prompt);
    ResponseEntity<String> response =
        restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);
    return JsonHelper.getResponse(response.getBody());
  }
}
