package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.SocialNetwork.TopicEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.TopicMapper;
import com.satvik.satchat.payload.topic.TopicCreationRequest;
import com.satvik.satchat.payload.topic.TopicResponse;
import com.satvik.satchat.payload.topic.TopicUpdateRequest;
import com.satvik.satchat.repository.TopicRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TopicService {

  private final TopicRepository topicRepository;

  private final TopicMapper topicMapper;

  public TopicService(TopicRepository topicRepository, TopicMapper topicMapper) {
    this.topicRepository = topicRepository;
    this.topicMapper = topicMapper;
  }

  public PageResponse<TopicResponse> getTopics(int page, int size, String search) {
    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }

    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);

    // check if search is null or empty
    String searchQuery = search == null ? "" : search;
    var topics = topicRepository.findAllTopic(pageable, searchQuery);

    return PageResponse.<TopicResponse>builder()
        .currentPage(page)
        .pageSize(topics.getSize())
        .totalPages(topics.getTotalPages())
        .totalElements(topics.getTotalElements())
        .data(topics.getContent().stream().map(topicMapper::topicResponse).toList())
        .build();
  }

  @Transactional
  public TopicResponse createTopic(TopicCreationRequest topicCreationRequest) {
    Optional<TopicEntity> optEntity = topicRepository.findByName(topicCreationRequest.getName());
    if (optEntity.isPresent()) {
      log.error("Topic already exists");
      throw new AppException(ErrorCode.TOPIC_EXISTED);
    }

    TopicEntity topicEntity =
        TopicEntity.builder()
            .id(UUID.randomUUID())
            .name(topicCreationRequest.getName())
            .color(topicCreationRequest.getColor())
            .build();
    topicRepository.save(topicEntity);

    return topicMapper.topicResponse(topicEntity);
  }

  @Transactional
  public Boolean updateTopic(UUID uuid, TopicUpdateRequest topicUpdateRequest) {
    Optional<TopicEntity> optEntity = topicRepository.findById(uuid);
    if (!optEntity.isPresent()) {
      log.error("Topic does not exist");
      throw new AppException(ErrorCode.TOPIC_NOT_EXISTED);
    }

    TopicEntity topicEntity = optEntity.get();
    topicEntity.setName(topicUpdateRequest.getName());
    topicEntity.setColor(topicUpdateRequest.getColor());
    topicRepository.save(topicEntity);

    return true;
  }

  @Transactional
  public Boolean deleteTopic(UUID uuid) {
    Optional<TopicEntity> optEntity = topicRepository.findById(uuid);
    if (!optEntity.isPresent()) {
      log.error("Topic does not exist");
      throw new AppException(ErrorCode.TOPIC_NOT_EXISTED);
    }

    topicRepository.delete(optEntity.get());

    Optional<TopicEntity> optEntityAfterDelete = topicRepository.findById(uuid);
    if (optEntityAfterDelete.isPresent()) {
      log.error("Failed to delete topic");
      throw new AppException(ErrorCode.FAILED_TO_DELETE_TOPIC);
    }

    return true;
  }
}
