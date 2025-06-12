package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.TopicEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<TopicEntity, UUID> {

  Optional<TopicEntity> findByName(String name);

  @Query(
      value =
          "SELECT t FROM TopicEntity t "
              + "WHERE (:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))")
  Page<TopicEntity> findAllTopic(Pageable pageable, @Param("search") String search);
}
