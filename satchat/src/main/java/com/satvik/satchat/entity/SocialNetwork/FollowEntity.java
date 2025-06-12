package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "follow", schema = "public")
public class FollowEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "follower", nullable = false)
  private UserEntity follower;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "following", nullable = false)
  private UserEntity following;
}
