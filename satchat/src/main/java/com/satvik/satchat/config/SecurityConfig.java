package com.satvik.satchat.config;

import com.satvik.satchat.config.oauth2.OAuth2LoginSuccessHandler;
import com.satvik.satchat.filter.RestApiTokenFilter;
import com.satvik.satchat.security.jwt.AuthEntryPointJwt;
import com.satvik.satchat.security.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

  private static final String[] ENDPOINTS = {
    "/vnpay-payment",
    "/submitOrder",
    "/api/test/**",
    "/api/auth/**",
    "/api/topic/**",
    "/api/users/**",
    "/api/posts/**",
    "/api/notifications/**",
    "/api/comments/**",
    "/api/conversation/**",
    "/minio/**",
    "/stomp",
    "/ws"
  };

  private final UserDetailsServiceImpl userDetailsService;

  private final AuthEntryPointJwt authEntryPointJwt;

  private final RestApiTokenFilter restApiTokenFilter;
  private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

  public SecurityConfig(
      UserDetailsServiceImpl userDetailsService,
      AuthEntryPointJwt authEntryPointJwt,
      RestApiTokenFilter restApiTokenFilter,
      OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
    this.userDetailsService = userDetailsService;
    this.authEntryPointJwt = authEntryPointJwt;
    this.restApiTokenFilter = restApiTokenFilter;
    this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
  }

  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
      throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPointJwt))
        .authorizeHttpRequests(
            requestMatcher ->
                requestMatcher
                    .requestMatchers(ENDPOINTS)
                    .permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .httpBasic(Customizer.withDefaults())
        .authenticationProvider(daoAuthenticationProvider())
        .oauth2Login(oauth -> oauth.successHandler(oAuth2LoginSuccessHandler))
        .addFilterBefore(restApiTokenFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
