package com.satvik.satchat.service;

import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.listeners.redis.MessagePublisher;
import com.satvik.satchat.repository.UserRepository;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

@Service
@EnableCaching
@Slf4j
public class TestService {
  private final MessagePublisher publisher;
  private final UserRepository userRepository;

  public TestService(MessagePublisher publisher, UserRepository userRepository) {
    this.publisher = publisher;
    this.userRepository = userRepository;
  }

  @Cacheable("cache")
  public List<UserEntity> saveCache() {
    log.info("Fetching data from database");
    return userRepository.findAll();
  }

  public void testPubSub() {
    publisher.publish("cache_topic", "Hello from Redis!");
  }
}
