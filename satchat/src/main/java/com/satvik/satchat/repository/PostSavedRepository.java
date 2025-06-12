package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.SocialNetwork.PostSavedEntity;
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
public interface PostSavedRepository extends JpaRepository<PostSavedEntity, UUID> {
  @Query("SELECT pse FROM PostSavedEntity pse " + "WHERE pse.author = ?1 AND pse.post = ?2")
  Optional<PostSavedEntity> findByAuthorAndPost(UserEntity author, PostEntity post);

  @Query("SELECT pse FROM PostSavedEntity pse " + "WHERE pse.author = ?1")
  List<PostSavedEntity> findByAuthor(UserEntity author);

  @Modifying
  @Query(value = "DELETE FROM PostSavedEntity pse " + "WHERE pse.author = ?1 AND pse.post = ?2")
  @Transactional
  void deleteByAuthorAndPost(@Param("author") UserEntity author, @Param("post") PostEntity post);

  @Query("SELECT pse FROM PostSavedEntity pse " + "WHERE pse.author = ?1")
  Page<PostSavedEntity> findAllByAuthor(UserEntity author, Pageable pageable);
}
