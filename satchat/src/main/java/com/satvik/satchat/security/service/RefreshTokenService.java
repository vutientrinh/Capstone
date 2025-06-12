package com.satvik.satchat.security.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.RefreshToken;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.repository.RefreshTokenRepository;
import com.satvik.satchat.repository.UserRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {
  @Value("120000")
  private Long refreshTokenDurationMs;

  @Autowired private RefreshTokenRepository refreshTokenRepository;
  @Autowired private UserRepository userRepository;

  public Optional<RefreshToken> findByToken(String token) {
    return refreshTokenRepository.findByToken(token);
  }

  public RefreshToken createRefreshToken(UUID userId) {
    Optional<RefreshToken> existingToken = refreshTokenRepository.findByUserId(userId);

    RefreshToken refreshToken;
    if (existingToken.isPresent()) {
      refreshToken = existingToken.get();
    } else {
      refreshToken = new RefreshToken();
      refreshToken.setUser(userRepository.findById(userId).get());
    }
    refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
    refreshToken.setToken(UUID.randomUUID().toString());

    refreshToken = refreshTokenRepository.save(refreshToken);
    return refreshToken;
  }

  public RefreshToken verifyExpiration(RefreshToken token) {
    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
      refreshTokenRepository.delete(token);
      throw new AppException(ErrorCode.TOKEN_REFRESH_EXCEPTION);
    }

    return token;
  }

  @Transactional
  public int deleteByUserId(UUID userId) {
    return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
  }
}
