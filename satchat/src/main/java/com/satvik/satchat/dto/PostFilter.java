package com.satvik.satchat.dto;

import com.satvik.satchat.model.Enum.EPostType;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostFilter {
  // 0: TEXT; 1: VIDEO;
  private EPostType type;
  private String topicName;
  private UUID authorId;
  private String keyword;
}
