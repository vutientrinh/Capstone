package com.satvik.satchat.utils;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.payload.authentication.IntrospectRequest;
import com.satvik.satchat.payload.authentication.IntrospectResponse;
import com.satvik.satchat.security.service.UserDetailsImpl;
import io.jsonwebtoken.*;
import java.security.SecureRandom;
import java.text.ParseException;
import java.util.Base64;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${bezkoder.app.jwtSecret}")
  private String jwtSecret;

  @Value("${bezkoder.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String generateJwtToken(UserDetailsImpl userPrincipal) {
    return generateTokenFromUsername(userPrincipal.getUsername());
  }

  public String generateTokenFromUsername(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
      return true;
    } catch (SignatureException e) {
      logger.error("Invalid JWT signature: {}", e.getMessage());
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }

  public UserDetailsImpl getUserDetailsFromJwtToken() {
    try {
      UserDetailsImpl userDetails =
          (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      return userDetails;
    } catch (Exception e) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }

  public String parseJwt(StompHeaderAccessor accessor) {
    String token = accessor.getFirstNativeHeader("Authorization");
    String jwt = null;
    if (token != null) {
      jwt = token.substring(7);
    }
    return jwt;
  }

  public IntrospectResponse introspect(IntrospectRequest request) {
    String token = request.getToken();

    try {
      byte[] secretBytes = Base64.getDecoder().decode(jwtSecret);
      log.info("Secret bytes length: {}", secretBytes.length);

      JWSVerifier verifier = new MACVerifier(secretBytes);
      SignedJWT signedJWT = SignedJWT.parse(token);
      Date expiredTime = signedJWT.getJWTClaimsSet().getExpirationTime();
      boolean verified = signedJWT.verify(verifier);
      return IntrospectResponse.builder().valid(verified && expiredTime.after(new Date())).build();
    } catch (JOSEException | ParseException e) {
      log.error("Error Introspecting token: {}", e.getMessage());
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }

  public boolean matches(String password, String encodedPassword) {
    return BCrypt.checkpw(password, encodedPassword);
  }

  public String generateRandomPassword(int length) {
    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";
    SecureRandom random = new SecureRandom();
    StringBuilder password = new StringBuilder(length);

    for (int i = 0; i < length; i++) {
      int index = random.nextInt(chars.length());
      password.append(chars.charAt(index));
    }

    return password.toString();
  }
}
