package com.satvik.satchat.repository;

import com.satvik.satchat.entity.RefreshToken;
import com.satvik.satchat.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByToken(String token);

  Optional<RefreshToken> findByUserId(UUID userId);

  @Modifying
  int deleteByUser(UserEntity user);
}
