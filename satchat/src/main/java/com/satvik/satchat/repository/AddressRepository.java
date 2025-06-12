package com.satvik.satchat.repository;

import com.satvik.satchat.entity.Ecommerce.AddressEntity;
import com.satvik.satchat.entity.UserEntity;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, UUID> {
  @Query("SELECT a FROM AddressEntity a WHERE a.user.id = :userId")
  Page<AddressEntity> findAllByUserId(UUID userId, Pageable pageable);

  @Modifying
  @Transactional
  @Query("DELETE FROM AddressEntity a WHERE a.user = :user AND a = :address")
  void deleteByUserAndAddress(
      @Param("user") UserEntity user, @Param("address") AddressEntity address);

  @Query("SELECT a FROM AddressEntity a WHERE a.user.id = :userId AND a.isDefault = true")
  Optional<AddressEntity> checkHaveDefaultAddress(UUID userId);

  @Modifying
  @Transactional
  @Query("UPDATE AddressEntity a SET a.isDefault = false WHERE a.user.id = :userId")
  void setAllAddressesToNotDefault(UUID userId);
}
