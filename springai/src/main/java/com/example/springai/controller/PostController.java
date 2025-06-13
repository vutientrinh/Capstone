package com.example.springai.controller;

import com.example.springai.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Slf4j
public class PostController {
  private PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @PostMapping("/get-post")
  public String getUser(@RequestBody String json) throws Exception {
    log.info("Inserting product data: {}", json);
    postService.insertPost(json);
    return "Post data";
  }

  @PostMapping("/liked-post")
  public String likedPost(@RequestBody String json) throws Exception {
    log.info("Liked Post data: {}", json);
    postService.setUserKeywords(json);
    return "Liked Post data";
  }

  @PostMapping("/saved-post")
  public String savedPost(@RequestBody String json) throws Exception {
    log.info("Saved Post data: {}", json);
    postService.setUserKeywords(json);
    return "Saved Post data";
  }
}
