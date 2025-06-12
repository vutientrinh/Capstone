package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.CommentLikedEntity;
import com.satvik.satchat.entity.UserEntity;
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
public interface CommentLikedRepository extends JpaRepository<CommentLikedEntity, UUID> {

  @Query(
      "SELECT c FROM CommentLikedEntity c WHERE c.author.id = :authorId AND c.comment.id = :commentId")
  Optional<CommentLikedEntity> findByAuthorAndCommentId(
      @Param("authorId") UUID authorId, @Param("commentId") UUID commentId);

  @Modifying
  @Transactional
  @Query(
      "DELETE FROM CommentLikedEntity c WHERE c.author.id = :authorId AND c.comment.id = :commentId")
  void deleteByAuthorAndCommentId(
      @Param("authorId") UUID authorId, @Param("commentId") UUID commentId);

  @Query("SELECT c.author FROM CommentLikedEntity c WHERE c.comment.id = :commentId")
  Page<UserEntity> findLikedUsers(@Param("commentId") UUID commentId, Pageable pageable);

  @Query("SELECT c.author FROM CommentLikedEntity c WHERE c.comment.id = :commentId")
  List<UserEntity> findAllLikedUsers(@Param("commentId") UUID commentId);
}
