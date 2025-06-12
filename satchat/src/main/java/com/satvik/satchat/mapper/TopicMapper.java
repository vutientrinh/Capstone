package com.satvik.satchat.mapper;

import com.satvik.satchat.entity.SocialNetwork.TopicEntity;
import com.satvik.satchat.payload.topic.TopicResponse;
import com.satvik.satchat.repository.PostRepository;
import com.satvik.satchat.repository.TopicRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TopicMapper {
  private final ModelMapper mapper = new ModelMapper();
  private final PostRepository postRepository;
  private final TopicRepository topicRepository;

  public TopicMapper(PostRepository postRepository, TopicRepository topicRepository) {
    this.postRepository = postRepository;
    this.topicRepository = topicRepository;
  }

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return mapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error mapping entity to class: {}", e.getMessage());
      throw new RuntimeException("Error mapping entity to class: " + e.getMessage());
    }
  }

  public TopicResponse topicResponse(TopicEntity topicEntity) {
    int countPost = postRepository.countByTopic(topicEntity);
    return TopicResponse.builder()
        .id(String.valueOf(topicEntity.getId()))
        .name(topicEntity.getName())
        .postCount(countPost)
        .color(topicEntity.getColor())
        .createdAt(topicEntity.getCreatedAt().toString())
        .updatedAt(topicEntity.getUpdatedAt().toString())
        .build();
  }
}
