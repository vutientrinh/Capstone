package com.satvik.satchat.config.oauth2;

import com.satvik.satchat.entity.RoleEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.ERole;
import com.satvik.satchat.repository.RoleRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

  @Value("${frontend.url}")
  private String FrontendURL;

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final JwtUtils jwtUtils;

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException, ServletException {

    OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
    OAuth2User oAuth2User = oauthToken.getPrincipal();

    Map<String, Object> attributes = oAuth2User.getAttributes();
    String givenName = (String) oAuth2User.getAttribute("given_name");
    String familyName = (String) oAuth2User.getAttribute("family_name");
    String email = (String) oAuth2User.getAttribute("email");
    String picture = (String) oAuth2User.getAttribute("picture");

    if (!userRepository.existsByEmail(email)) {
      String username = generateUsername(givenName, email);
      UserEntity userEntity =
          UserEntity.builder()
              .id(UUID.randomUUID())
              .username(username)
              .email(email)
              .password(null)
              .firstName(givenName)
              .lastName(familyName)
              .websiteUrl("")
              .bio("")
              .build();
      Set<RoleEntity> roles = new HashSet<>();
      RoleEntity userRole =
          roleRepository
              .findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
      userEntity.setRoles(roles);
      userRepository.save(userEntity);
    }

    UserEntity user = userRepository.findByEmail(email).orElseThrow();
    String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());
    String redirectUrl =
        UriComponentsBuilder.fromUriString(FrontendURL + "/oauth2/redirect")
            .queryParam("token", jwt)
            .queryParam("userId", user.getId())
            .queryParam("username", user.getUsername())
            .queryParam("email", user.getEmail())
            .queryParam(
                "role",
                user.getRoles().stream()
                    .findFirst()
                    .map(role -> role.getName().name())
                    .orElse("ROLE_USER"))
            .build()
            .toUriString();

    response.sendRedirect(redirectUrl);
  }

  private String generateUsername(String givenName, String email) {
    if (givenName != null && !givenName.isEmpty()) {
      return givenName.toLowerCase().replaceAll("[^a-z0-9]", "")
          + "-"
          + UUID.randomUUID().toString().substring(0, 8);
    }
    if (email != null) {
      return email.split("@")[0] + "-" + UUID.randomUUID().toString().substring(0, 6);
    }
    return "user-" + UUID.randomUUID().toString().substring(0, 10);
  }
}
