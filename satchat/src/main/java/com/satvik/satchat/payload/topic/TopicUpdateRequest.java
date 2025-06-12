package com.satvik.satchat.payload.topic;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@Slf4j
public class TopicUpdateRequest {
  @NotNull(message = "TOPIC_NAME_REQUIRED")
  private String name;

  @NotNull(message = "TOPIC_COLOR_REQUIRED")
  @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "INVALID_COLOR_FORMAT")
  private String color;
}
