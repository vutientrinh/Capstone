package com.satvik.satchat.mapper;

import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FollowMapper {
  private final ModelMapper mapper = new ModelMapper();

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }
}
