package com.example.springai.controller;

import com.example.springai.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {
  private UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/get-user")
  public String getUser(@RequestBody String json) throws JsonProcessingException {
    userService.insertUser(json);
    return "User data";
  }
}
