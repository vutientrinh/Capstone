package com.satvik.satchat.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;
import redis.clients.jedis.JedisPool;

@Service
@Slf4j
@EnableCaching
public class CacheService {
  private final JedisPool jedisPool;

  public CacheService(JedisPool jedisPool) {
    this.jedisPool = jedisPool;
  }

  public void set(String key, String value) {
    try (var jedis = jedisPool.getResource()) {
      jedis.set(key, value);
    }
  }

  public String get(String key) {
    try (var jedis = jedisPool.getResource()) {
      return jedis.get(key);
    }
  }

  public void delete(String key) {
    try (var jedis = jedisPool.getResource()) {
      jedis.del(key);
    }
  }
}
