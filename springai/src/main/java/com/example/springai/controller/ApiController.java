package com.example.springai.controller;

import com.example.springai.dto.Parts;
import com.example.springai.dto.Prompt;
import com.example.springai.service.AppService;
import com.example.springai.utils.RequestUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Slf4j
public class ApiController {

  private final AppService appService;
  private final RequestUtils requestUtils;

  public ApiController(AppService appService, RequestUtils requestUtils) {
    this.appService = appService;
    this.requestUtils = requestUtils;
  }

  @PostMapping("/inference")
  String getResponseFromGemini(@RequestBody Parts parts) throws Exception {

    Prompt prompt = requestUtils.bodyExtractKeywords(parts);
    return appService.getKeywords(prompt, parts);
  }

  @PostMapping("/rec-posts")
  String getRecPosts(@RequestBody String userId) throws Exception {
    Prompt prompt = requestUtils.bodyRecPost(userId);
    return appService.getRecPosts(prompt, userId);
  }

  @PostMapping("/rec-products")
  String getRecProducts(@RequestBody String userId) throws Exception {
    Prompt prompt = requestUtils.bodyRecProduct(userId);
    return appService.getRecProducts(prompt, userId);
  }

  @PostMapping("/{userId}/ask")
  public String getAsk(@PathVariable("userId") String userId, @RequestBody String question)
      throws Exception {
    Prompt prompt = requestUtils.bodyChatBot(userId, question);
    return appService.getAsk(prompt, userId);
  }

  @PostMapping("/check-policy")
  public String checkPolicy(@RequestBody String input) throws Exception {
    Prompt prompt = requestUtils.bodyContentPolicy(input);
    return appService.getCheckPolicy(prompt).replace("```json\n", "").replace("\n```", "").trim();
  }
}
