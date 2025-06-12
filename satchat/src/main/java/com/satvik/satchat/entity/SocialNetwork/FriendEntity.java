package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.EFriend;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "friend", schema = "public")
public class FriendEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "requester", nullable = false)
  private UserEntity requester;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "receiver", nullable = false)
  private UserEntity receiver;

  @Builder.Default
  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private EFriend status = EFriend.PENDING;
}
