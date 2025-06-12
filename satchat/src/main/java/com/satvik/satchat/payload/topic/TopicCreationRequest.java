package com.satvik.satchat.payload.topic;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicCreationRequest {
  @NotNull private String name;

  @NotNull
  @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "INVALID_COLOR_FORMAT")
  private String color;
}
