package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "topic")
public class TopicEntity extends Auditable {
  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @Column(name = "name", columnDefinition = "text")
  private String name;

  @Builder.Default
  @Column(name = "postCount", columnDefinition = "integer")
  private Integer postCount = 0;

  @Column(name = "color", columnDefinition = "text")
  @Builder.Default
  private String color = "#008000";
}
