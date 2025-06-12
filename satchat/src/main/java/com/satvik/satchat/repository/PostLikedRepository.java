package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.PostEntity;
import com.satvik.satchat.entity.SocialNetwork.PostLikedEntity;
import com.satvik.satchat.entity.UserEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikedRepository extends JpaRepository<PostLikedEntity, UUID> {

  @Query("SELECT ple FROM PostLikedEntity ple " + "WHERE ple.author = ?1 AND ple.post = ?2")
  Optional<PostLikedEntity> findByAuthorAndPost(UserEntity author, PostEntity post);

  @Modifying
  @Query(value = "DELETE FROM PostLikedEntity pse " + "WHERE pse.author = ?1 AND pse.post = ?2")
  @Transactional
  void deleteByAuthorAndPost(UserEntity author, PostEntity post);

  @Query("SELECT ple.author FROM PostLikedEntity ple " + "WHERE ple.post = ?1")
  List<UserEntity> findLikedUsers(PostEntity post);
}
