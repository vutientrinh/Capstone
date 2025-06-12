package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.MessageType;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notification", schema = "public")
public class NotificationEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "receiver", nullable = false)
  private UserEntity receiver;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "actor", nullable = false)
  private UserEntity actor;

  @Column(name = "content", nullable = false)
  private String content;

  @Column(name = "messageType", nullable = false)
  @Enumerated(EnumType.STRING)
  private MessageType messageType;

  @Column(name = "isSent", nullable = false)
  @Builder.Default
  private Boolean isSent = false;

  @Column(name = "isRead", nullable = false)
  @Builder.Default
  private Boolean isRead = false;
}
