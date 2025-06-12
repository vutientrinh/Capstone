package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.CommentEntity;
import jakarta.transaction.Transactional;
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
public interface CommentRepository extends JpaRepository<CommentEntity, UUID> {
  /** EComment enum PENDING: 0 APPROVED: 1 REJECTED: 2 DELETED: 3 SPAM: 4 */
  @Query("SELECT c FROM CommentEntity c WHERE c.author.id = :userId AND c.status = 1")
  Page<CommentEntity> getComments(@Param("userId") UUID userId, Pageable pageable);

  @Query("SELECT c FROM CommentEntity c WHERE c.post.id = :postId AND c.status = 1")
  Page<CommentEntity> getCommentByPost(@Param("postId") UUID postId, Pageable pageable);

  @Query("SELECT c FROM CommentEntity c WHERE c.id = :commentId AND c.status = 3")
  Optional<CommentEntity> isDeleted(@Param("commentId") UUID commentId);

  @Modifying
  @Query("UPDATE CommentEntity c SET c.likedCount = c.likedCount + 1 WHERE c.id = :commentId")
  @Transactional
  void increaseLikeCount(@Param("commentId") UUID commentId);

  @Modifying
  @Query("UPDATE CommentEntity c SET c.likedCount = c.likedCount - 1 WHERE c.id = :commentId")
  @Transactional
  void decreaseLikeCount(@Param("commentId") UUID commentId);

  @Query("SELECT c FROM CommentEntity c")
  Page<CommentEntity> getAllComments(Pageable pageable);
}
