package com.satvik.satchat.mapper;

import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.payload.user.FriendRequestDTO;
import com.satvik.satchat.payload.user.RequestResponse;
import com.satvik.satchat.payload.user.UserFollowResponse;
import com.satvik.satchat.payload.user.UserProfileResponse;
import java.util.Collections;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserMapper {
  private final ModelMapper mapper = new ModelMapper();

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      if (entity instanceof UserEntity userEntity && outClass.equals(UserProfileResponse.class)) {
        UserProfileResponse response = mapper.map(userEntity, UserProfileResponse.class);

        response.setRoles(
            userEntity.getRoles() != null
                ? userEntity.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet())
                : Collections.emptySet());

        return outClass.cast(response);
      }
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }

  public UserFollowResponse toUserFollowResponse(UserEntity userEntity) {
    return UserFollowResponse.builder()
        .id(userEntity.getId())
        .username(userEntity.getUsername())
        .firstName(userEntity.getFirstName())
        .lastName(userEntity.getLastName())
        .avatar(userEntity.getAvatar())
        .followAt(userEntity.getUpdatedAt().toString())
        .build();
  }

  /** input: FriendRequestDTO output: RequestResponse */
  public RequestResponse toRequestResponse(FriendRequestDTO friendRequestDTO) {
    UUID requestId = friendRequestDTO.getId();
    UserEntity userEntity = friendRequestDTO.getRequester();

    return RequestResponse.builder()
        .id(userEntity.getId())
        .requestId(requestId)
        .username(userEntity.getUsername())
        .firstName(userEntity.getFirstName())
        .lastName(userEntity.getLastName())
        .avatar(userEntity.getAvatar())
        .createdAt(userEntity.getCreatedAt().toString())
        .build();
  }
}
