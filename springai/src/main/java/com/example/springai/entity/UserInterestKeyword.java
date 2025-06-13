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
    name = "user_interest_keywords",
    uniqueConstraints = @UniqueConstraint(name = "unique_user_interest", columnNames = "user_id"))
public class UserInterestKeyword {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false, unique = true)
  private String userId;

  @Lob
  @Column(nullable = false)
  private String keyword;

  @Column(
      name = "updated_at",
      nullable = false,
      insertable = false,
      updatable = false,
      columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  @Builder.Default
  private Instant updatedAt = Instant.now();
}
