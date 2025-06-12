package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.EPost;
import com.satvik.satchat.model.Enum.EPostStatus;
import com.satvik.satchat.model.Enum.EPostType;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post", schema = "public")
public class PostEntity extends Auditable {
  @Id
  @Column(name = "id", nullable = false)
  private UUID id;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(name = "images")
  @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  private List<FileEntity> images;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "author", nullable = false)
  private UserEntity author;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "topic", nullable = false)
  private TopicEntity topic;

  private EPostStatus status;

  @Builder.Default private Integer commentCount = 0;

  @Builder.Default private Integer likedCount = 0;

  private EPostType type;

  @Builder.Default private EPost postStatus = EPost.APPROVED;
}
