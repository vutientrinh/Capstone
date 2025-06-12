package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.EComment;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments", schema = "public")
public class CommentEntity extends Auditable {
  private static final long serialVersionUID = 1L;

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "author", nullable = false)
  private UserEntity author;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "post", nullable = false)
  private PostEntity post;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Builder.Default private Integer likedCount = 0;

  @Builder.Default private EComment status = EComment.APPROVED;
}
