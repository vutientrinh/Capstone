package com.satvik.satchat.payload.topic;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
  private String id;
  private String name;
  private Integer postCount;
  private String color;
  private String createdAt;
  private String updatedAt;
}
