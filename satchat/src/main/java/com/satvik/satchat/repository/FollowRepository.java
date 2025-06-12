package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.FollowEntity;
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
public interface FollowRepository extends JpaRepository<FollowEntity, UUID> {

  @Query(
      "SELECT f FROM FollowEntity f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
  Optional<FollowEntity> findFollowByFollowerIdAndFollowingId(
      @Param("followerId") UUID followerId, @Param("followingId") UUID followingId);

  @Query("SELECT f.follower FROM FollowEntity f WHERE f.following.id = :userId")
  Page<UserEntity> findFollowersByUserId(@Param("userId") UUID userId, Pageable pageable);

  @Query("SELECT f.following FROM FollowEntity f WHERE f.follower.id = :userId")
  Page<UserEntity> findFollowingsByUserId(@Param("userId") UUID userId, Pageable pageable);

  @Query("SELECT f.following.id FROM FollowEntity f WHERE f.follower.id = :userId")
  List<UUID> findFollowingIdsByUserId(@Param("userId") UUID userId);

  @Query("SELECT f.follower.id FROM FollowEntity f WHERE f.following.id = :userId")
  List<UUID> findFollowerIdsByUserId(@Param("userId") UUID userId);

  @Modifying
  @Query("DELETE FROM FollowEntity f WHERE f.id = :followId")
  @Transactional
  void deleteByFollowId(@Param("followId") UUID followId);
}
