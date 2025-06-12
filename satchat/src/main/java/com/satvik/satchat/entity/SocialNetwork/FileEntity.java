package com.satvik.satchat.entity.SocialNetwork;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.FileStatus;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "file", schema = "public")
public class FileEntity extends Auditable {
  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @Column(name = "filename", nullable = false)
  String filename;

  @Column(name = "content_type", nullable = false)
  String contentType;

  @Column(name = "file_size", nullable = false)
  Long fileSize;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "author", nullable = false)
  private UserEntity author;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private FileStatus status = FileStatus.ACTIVE;
}
