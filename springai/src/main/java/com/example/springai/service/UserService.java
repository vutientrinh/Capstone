package com.example.springai.service;

import com.example.springai.model.User;
import com.example.springai.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  public UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public void insertUser(String json) throws JsonProcessingException {
    json = json.replaceAll("\"null\"", "null");
    ObjectMapper mapper = new ObjectMapper();
    mapper.findAndRegisterModules();
    User user = mapper.readValue(json, User.class);

    if (!userRepository.existsById(user.getId())) {
      userRepository.insertUser(
          user.getId(),
          user.getCreatedAt(),
          user.getUpdatedAt(),
          user.getAvatar(),
          user.getBio(),
          user.getCover(),
          user.getEmail(),
          user.getFirstName(),
          user.getFollowerCount(),
          user.getLastName(),
          user.getPassword(),
          user.getPostCount(),
          user.getStatus(),
          user.getUsername(),
          user.getWebsiteUrl(),
          user.getFriendsCount());
    }
  }
}
