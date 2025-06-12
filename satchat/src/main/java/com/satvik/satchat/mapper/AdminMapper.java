package com.satvik.satchat.mapper;

import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AdminMapper {
  private final ModelMapper modelMapper = new ModelMapper();

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return modelMapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error in mapping {} to {}", entity, outClass, e);
      return null;
    }
  }
}
