package com.satvik.satchat.entity;

import com.satvik.satchat.model.Enum.EStatus;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "users", schema = "public", catalog = "postgres")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UserEntity extends Auditable implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @Column(name = "username", nullable = true, length = 100)
  private String username;

  @Column private String email;

  @Column private String password;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<RoleEntity> roles = new HashSet<>();

  @Column private String cover;

  @Column private String avatar;

  @Column private String firstName;

  @Column private String lastName;

  @Column private String bio;

  @Column private String websiteUrl;

  @Column @Builder.Default private Integer followerCount = 0;

  @Column @Builder.Default private Integer friendsCount = 0;

  @Column @Builder.Default private Integer postCount = 0;

  @Column @Builder.Default private EStatus status = EStatus.ACTIVE;

  public String getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
