package com.satvik.satchat.entity.Ecommerce;

import com.satvik.satchat.entity.Auditable;
import com.satvik.satchat.entity.UserEntity;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "address")
public class AddressEntity extends Auditable {

  @Id
  @Column(name = "id", nullable = false, columnDefinition = "uuid", updatable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, optional = false)
  @JoinColumn(name = "user_id")
  private UserEntity user;

  private String phone;
  private String address;
  private String wardCode;
  private String wardName;
  private int districtId;
  private String districtName;
  private int provinceId;
  private String provinceName;
  @Builder.Default private Boolean isDefault = false;
}
