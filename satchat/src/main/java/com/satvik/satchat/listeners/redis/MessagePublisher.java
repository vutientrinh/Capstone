package com.satvik.satchat.listeners.redis;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MessagePublisher {
  private final RedisTemplate<String, Object> redisTemplate;

  public MessagePublisher(RedisTemplate<String, Object> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  public void publish(String topic, String message) {
    log.info("Publishing message: {} to topic: {}", message, topic);
    redisTemplate.convertAndSend(topic, message);
  }
}
