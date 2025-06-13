package com.example.springai.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "post_recommendation",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}),
    indexes = @Index(name = "idx_user_post", columnList = "user_id, post_id"))
public class PostRecommendation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "post_id", nullable = false)
  private String postId;

  private float score = 0.0f;

  @Lob private String reason;

  @Column(
      name = "recommended_at",
      nullable = false,
      updatable = false,
      insertable = false,
      columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  @Builder.Default
  private Instant recommendedAt = Instant.now();
}
