package com.example.springai.service;

import com.example.springai.dto.Parts;
import com.example.springai.dto.Prompt;
import java.time.Duration;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AppService {
  private final RedisTemplate<String, Object> redisTemplate;
  private final GeminiAIService geminiService;
  private final ExecutorService executorService = Executors.newSingleThreadExecutor();

  public AppService(RedisTemplate<String, Object> redisTemplate, GeminiAIService geminiService) {
    this.redisTemplate = redisTemplate;
    this.geminiService = geminiService;
  }

  public String getKeywords(Prompt prompt, Parts parts) throws Exception {
    Object[] lstKey = (Object[]) geminiService.callGemini(prompt);
    String response = Arrays.toString(lstKey);
    return response;
  }

  public String getRecPosts(Prompt prompt, String userId) throws Exception {
    String cacheKey = "rec-posts::" + userId;
    String cachedData = (String) redisTemplate.opsForValue().get(cacheKey);
    executorService.submit(
        () -> {
          try {
            System.out.println("Async preparing rec-posts for user: " + userId);
            Object[] lstKey = (Object[]) geminiService.callGemini(prompt);
            String response = Arrays.toString(lstKey);
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(10));
          } catch (Exception e) {
            e.printStackTrace();
          }
        });
    if (cachedData != null) {
      return cachedData;
    }
    return "[]";
  }

  public String getRecProducts(Prompt prompt, String userId) throws Exception {
    String cacheKey = "rec-products::" + userId;
    String cachedData = (String) redisTemplate.opsForValue().get(cacheKey);
    executorService.submit(
        () -> {
          try {
            System.out.println("Async preparing rec-products for user: " + userId);
            Object[] lstKey = (Object[]) geminiService.callGemini(prompt);
            String response = Arrays.toString(lstKey);
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(10));
          } catch (Exception e) {
            e.printStackTrace();
          }
        });
    if (cachedData != null) {
      return cachedData;
    }
    return "[]";
  }

  public String getAsk(Prompt prompt, String userId) throws Exception {
    System.out.println("Async preparing ask for user: " + userId);
    String answer = geminiService.getResponseFromGemini(prompt);
    return answer != null ? answer : "Sorry, I don't know the answer.";
  }

  public String getCheckPolicy(Prompt prompt) throws Exception {
    String response = geminiService.getResponseFromGemini(prompt);
    return response != null ? response : "Content policy check failed.";
  }
}
