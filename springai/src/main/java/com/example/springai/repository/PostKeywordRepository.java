package com.example.springai.repository;

import com.example.springai.entity.PostKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostKeywordRepository extends JpaRepository<PostKeyword, Long> {

  @Query(
      """
        SELECT CASE WHEN COUNT(pk) > 0 THEN TRUE ELSE FALSE END
        FROM PostKeyword pk
        WHERE pk.postId = :postId
          AND pk.keyword IS NOT NULL
          AND pk.keyword <> ''
    """)
  Boolean isExistKeywords(@Param("postId") String postId);
}
