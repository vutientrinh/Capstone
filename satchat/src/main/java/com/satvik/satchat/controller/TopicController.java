package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.topic.TopicCreationRequest;
import com.satvik.satchat.payload.topic.TopicResponse;
import com.satvik.satchat.payload.topic.TopicUpdateRequest;
import com.satvik.satchat.service.TopicService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/topic")
public class TopicController {

  @Resource private TopicService topicService;

  @GetMapping("/all")
  public ResponseEntity<?> getAllTopics(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size,
      @RequestParam(value = "search", required = false) String search) {
    return ResponseEntity.ok(topicService.getTopics(page, size, search));
  }

  @PostMapping
  public ResponseEntity<?> createTopic(
      @Valid @RequestBody TopicCreationRequest topicCreationRequest) {
    TopicResponse topic = topicService.createTopic(topicCreationRequest);
    if (topic != null) {
      return ResponseEntity.ok(DataResponse.builder().data(topic).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @PutMapping("/{uuid}")
  public ResponseEntity<?> updateTopic(
      @PathVariable("uuid") UUID uuid, @Valid @RequestBody TopicUpdateRequest topicUpdateRequest) {
    Boolean success = topicService.updateTopic(uuid, topicUpdateRequest);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<?> deleteTopic(@PathVariable("uuid") UUID uuid) {
    Boolean success = topicService.deleteTopic(uuid);
    if (success) {
      return ResponseEntity.ok(DataResponse.builder().data(true).build());
    }
    return ResponseEntity.badRequest().body(DataResponse.builder().data(false).build());
  }
}
