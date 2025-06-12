package com.satvik.satchat.repository;

import com.satvik.satchat.dto.PostFilter;
import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.SocialNetwork.TopicEntity;
import com.satvik.satchat.model.Enum.EPostStatus;
import com.satvik.satchat.model.Enum.EPostType;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, UUID> {

  @Modifying
  @Query(
      """
      UPDATE PostEntity p
      SET
          p.content = :content,
          p.topic = :topic,
          p.status = :status,
          p.type = :type
      WHERE
          p.id = :postId
  """)
  void updatePost(
      @Param("postId") UUID postId,
      @Param("content") String content,
      @Param("topic") TopicEntity topic,
      @Param("status") EPostStatus status,
      @Param("type") EPostType type);

  @Query(
      value =
          "SELECT p "
              + "FROM PostEntity p "
              + "WHERE " // p.postStatus = 0"
              + "(:#{#filter.topicName} IS NULL OR p.topic.name = :#{#filter.topicName}) "
              + "AND (:#{#filter.authorId} IS NULL OR p.author.id = :#{#filter.authorId}) "
              + "AND (:#{#filter.type} IS NULL OR p.type = :#{#filter.type}) "
              + "AND (:#{#filter.keyword} IS NULL OR p.content LIKE %:#{#filter.keyword}%) "
              + "ORDER BY p.createdAt DESC")
  Page<PostEntity> findAllPost(@Param("filter") PostFilter filter, Pageable pageable);

  @Query(
      value =
          "SELECT p "
              + "FROM PostEntity p "
              + "WHERE p.postStatus = 0"
              + "AND (:#{#filter.topicName} IS NULL OR p.topic.name = :#{#filter.topicName}) "
              + "AND (:#{#filter.authorId} IS NULL OR p.author.id = :#{#filter.authorId}) "
              + "AND (:#{#filter.type} IS NULL OR p.type = :#{#filter.type}) "
              + "AND (:#{#filter.keyword} IS NULL OR p.content LIKE %:#{#filter.keyword}%) "
              + "ORDER BY p.likedCount DESC")
  Page<PostEntity> findAllPostTrending(@Param("filter") PostFilter filter, Pageable pageable);

  @Modifying
  @Query(value = "DELETE FROM PostEntity p WHERE p.id = :postId")
  @Transactional
  void deleteById(@Param("postId") UUID postId);

  @Modifying
  @Query(value = "UPDATE PostEntity p SET p.likedCount = p.likedCount + 1 WHERE p.id = :postId")
  @Transactional
  void increasedLikeCount(@Param("postId") UUID postId);

  @Modifying
  @Query(value = "UPDATE PostEntity p SET p.likedCount = p.likedCount - 1 WHERE p.id = :postId")
  @Transactional
  void decreasedLikeCount(@Param("postId") UUID postId);

  @Query(value = "SELECT p FROM PostEntity p WHERE p.id = :postId AND p.postStatus = 0")
  Optional<PostEntity> findPostById(@Param("postId") UUID postId);

  @Modifying
  @Query(value = "UPDATE PostEntity p SET p.commentCount = p.commentCount + 1 WHERE p.id = :postId")
  @Transactional
  void increaseCommentCount(@Param("postId") UUID postId);

  @Modifying
  @Query(value = "UPDATE PostEntity p SET p.commentCount = p.commentCount - 1 WHERE p.id = :postId")
  @Transactional
  void decreaseCommentCount(@Param("postId") UUID postId);

  @Query(
      value =
          "SELECT COUNT(p) "
              + "FROM PostEntity p "
              + "WHERE p.topic = :topicEntity "
              + "AND p.postStatus = 0")
  int countByTopic(TopicEntity topicEntity);

  @Query(
      value =
          "SELECT p.id "
              + "FROM PostEntity p "
              + "WHERE p.postStatus = 0 "
              + "ORDER BY (p.commentCount * 2 + p.likedCount) DESC, p.createdAt DESC")
  List<UUID> findAllPostIdsTrending();

  @Query(
      value =
          "SELECT p "
              + "FROM PostEntity p "
              + "WHERE p.postStatus = 0 "
              + "AND p.author.id = :authorId "
              + "ORDER BY p.createdAt DESC")
  List<PostEntity> findAllByAuthorId(@Param("authorId") UUID authorId);
}
