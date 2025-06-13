package com.example.springai.repository;

import com.example.springai.model.Post;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
  @Modifying
  @Transactional
  @Query(
      value =
          """
                    INSERT INTO post (
                        id, created_at, updated_at, comment_count, content, images, liked_count,
                        status, type, author, topic, post_status
                    ) VALUES (
                        :id, :createdAt, :updatedAt, :commentCount, :content, :images, :likedCount,
                        :status, :type, :author, :topic, :postStatus
                    ) ON DUPLICATE KEY UPDATE
                        updated_at = :updatedAt,
                        comment_count = :commentCount,
                        content = :content,
                        images = :images,
                        liked_count = :likedCount,
                        status = :status,
                        post_status = :postStatus
                    """,
      nativeQuery = true)
  void insertPost(
      @Param("id") String id,
      @Param("createdAt") LocalDateTime createdAt,
      @Param("updatedAt") LocalDateTime updatedAt,
      @Param("commentCount") Integer commentCount,
      @Param("content") String content,
      @Param("images") String images,
      @Param("likedCount") Integer likedCount,
      @Param("status") Integer status,
      @Param("type") Integer type,
      @Param("author") String author,
      @Param("topic") String topic,
      @Param("postStatus") Integer postStatus);

  @Query(value = "SELECT keyword FROM post_keywords WHERE post_id = :postId", nativeQuery = true)
  String getKeywordsByPostId(@Param("postId") String postId);
}
