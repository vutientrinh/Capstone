package com.satvik.satchat.controller;

import com.satvik.satchat.common.ApiResponse;
import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.RefreshToken;
import com.satvik.satchat.entity.RoleEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.model.Enum.ERole;
import com.satvik.satchat.model.Enum.EStatus;
import com.satvik.satchat.payload.authentication.IntrospectRequest;
import com.satvik.satchat.payload.authentication.JwtResponse;
import com.satvik.satchat.payload.authentication.LoginRequest;
import com.satvik.satchat.payload.authentication.SignupRequest;
import com.satvik.satchat.payload.refreshToken.TokenRefreshRequest;
import com.satvik.satchat.payload.refreshToken.TokenRefreshResponse;
import com.satvik.satchat.repository.RoleRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.RefreshTokenService;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.service.UserService;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthenticationManager authenticationManager;

  private final UserRepository userRepository;

  private final RoleRepository roleRepository;

  private final PasswordEncoder encoder;

  private final JwtUtils jwtUtils;

  private final RefreshTokenService refreshTokenService;
  private final UserService userService;

  public AuthController(
      AuthenticationManager authenticationManager,
      UserRepository userRepository,
      RoleRepository roleRepository,
      PasswordEncoder passwordEncoder,
      RefreshTokenService refreshTokenService,
      JwtUtils jwtUtils,
      UserService userService) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.encoder = passwordEncoder;
    this.refreshTokenService = refreshTokenService;
    this.jwtUtils = jwtUtils;
    this.userService = userService;
  }

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(
      @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

    Authentication authentication;
    UserDetailsImpl userDetails;
    try {
      authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));
      SecurityContextHolder.getContext().setAuthentication(authentication);
      userDetails = (UserDetailsImpl) authentication.getPrincipal();
    } catch (Exception e) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    // Check account is BANNED or DELETED
    UserEntity user =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    if (user.getStatus().equals(EStatus.BANNED) || user.getStatus().equals(EStatus.DELETED)) {
      throw new AppException(ErrorCode.USER_NOT_ALLOWED);
    }

    String jwt = jwtUtils.generateJwtToken(userDetails);
    List<String> roles =
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

    JwtResponse jwtResponse =
        JwtResponse.builder()
            .token(jwt)
            .id(userDetails.getId())
            .refreshToken(refreshToken.getToken())
            .username(userDetails.getUsername())
            .roles(roles)
            .build();

    response.addCookie(new Cookie("access_token", jwt));
    return ResponseEntity.ok(jwtResponse);
  }

  @PostMapping("/register")
  @Transactional
  public ResponseEntity<?> registerUser(
      @RequestBody SignupRequest signUpRequest,
      @RequestParam(name = "firstname", required = false, defaultValue = "") String firstname,
      @RequestParam(name = "lastname", required = false, defaultValue = "") String lastname,
      @RequestParam(name = "websiteurl", required = false, defaultValue = "") String websiteurl,
      @RequestParam(name = "bio", required = false, defaultValue = "") String bio) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(
              ApiResponse.builder()
                  .code(ErrorCode.USER_EXISTED.getCode())
                  .message(ErrorCode.USER_EXISTED.getMessage())
                  .build());
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(
              ApiResponse.builder()
                  .code(ErrorCode.EMAIL_EXISTED.getCode())
                  .message(ErrorCode.EMAIL_EXISTED.getMessage())
                  .build());
    }

    UserEntity userEntity =
        UserEntity.builder()
            .id(UUID.randomUUID())
            .username(signUpRequest.getUsername())
            .email(signUpRequest.getEmail())
            .password(encoder.encode(signUpRequest.getPassword()))
            .firstName(firstname)
            .lastName(lastname)
            .websiteUrl(websiteurl)
            .bio(bio)
            .build();

    Set<String> strRoles = signUpRequest.getRole();
    Set<RoleEntity> roles = new HashSet<>();

    if (strRoles == null) {
      RoleEntity userRole =
          roleRepository
              .findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
      roles.add(userRole);
    } else {
      strRoles.forEach(
          role -> {
            if ("ADMIN".equals(role)) {
              RoleEntity adminRole =
                  roleRepository
                      .findByName(ERole.ROLE_ADMIN)
                      .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
              roles.add(adminRole);
            } else {
              RoleEntity userRole =
                  roleRepository
                      .findByName(ERole.ROLE_USER)
                      .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
              roles.add(userRole);
            }
          });
    }

    userEntity.setRoles(roles);
    userRepository.save(userEntity);

    return ResponseEntity.ok(
        ApiResponse.builder().message("User registered successfully!").build());
  }

  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
    String requestRefreshToken = request.getRefreshToken();

    return refreshTokenService
        .findByToken(requestRefreshToken)
        .map(refreshTokenService::verifyExpiration)
        .map(RefreshToken::getUser)
        .map(
            user -> {
              String token = jwtUtils.generateTokenFromUsername(user.getUsername());
              return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
            })
        .orElseThrow(() -> new AppException(ErrorCode.TOKEN_REFRESH_IS_NOT_IN_DATABASE));
  }

  @PostMapping("/signout")
  public ApiResponse<?> logoutUser() {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    UUID userId = userDetails.getId();
    refreshTokenService.deleteByUserId(userId);
    return ApiResponse.builder().message("User logged out successfully!").build();
  }

  @PostMapping("/introspect")
  public ResponseEntity<?> introspectToken(@Valid @RequestBody IntrospectRequest request) {
    return ResponseEntity.ok(jwtUtils.introspect(request));
  }

  @PostMapping("/recovery")
  public ResponseEntity<?> recoveryPassword(@RequestParam String email) throws MessagingException {
    return ResponseEntity.ok(userService.sendPasswordRecoveryEmail(email));
  }
}
