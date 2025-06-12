package com.satvik.satchat.repository;

import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.EStatus;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

  Optional<UserEntity> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  List<UserEntity> findAllByUsernameIn(Set<String> usernames);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.avatar = :avatar,
          u.cover = :cover,
          u.firstName = :firstName,
          u.lastName = :lastName,
          u.bio = :bio,
          u.websiteUrl = :websiteUrl
      WHERE
          u.id = :userId
  """)
  @Transactional
  void updateUser(
      @Param("userId") UUID userId,
      @Param("avatar") String avatar,
      @Param("cover") String cover,
      @Param("firstName") String firstName,
      @Param("lastName") String lastName,
      @Param("bio") String bio,
      @Param("websiteUrl") String websiteUrl);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.status = :status
      WHERE
          u.id = :userId
  """)
  @Transactional
  void updateUserStatus(@Param("userId") UUID userId, @Param("status") EStatus status);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.password = :password
      WHERE
          u.id = :userId
  """)
  @Transactional
  void updatePassword(@Param("userId") UUID userId, @Param("password") String password);

  @Query(
      value =
          """
      SELECT u
      FROM UserEntity u
      WHERE
          u.status <> 1 AND u.status <> 2 AND u.status <> 3
  """)
  Page<UserEntity> findAllUsers(Pageable pageable);

  @Query(
      value =
          """
      SELECT u FROM UserEntity u
      WHERE u.id <> :userId
      AND NOT EXISTS (
          SELECT 1 FROM FriendEntity f
          WHERE (f.requester.id = :userId AND f.receiver.id = u.id)
             OR (f.receiver.id = :userId AND f.requester.id = u.id)
      )
  """)
  Page<UserEntity> getUsersNotFriendsWith(@Param("userId") UUID userId, Pageable pageable);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.followerCount = u.followerCount + 1
      WHERE
          u.id = :userId
  """)
  @Transactional
  void increaseFollowers(@Param("userId") UUID userId);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.followerCount = u.followerCount - 1
      WHERE
          u.id = :userId
  """)
  @Transactional
  void decreasedFollowers(@Param("userId") UUID userId);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.postCount = u.postCount + 1
      WHERE
          u.id = :userId
  """)
  @Transactional
  void incrementPostCount(@Param("userId") UUID userId);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.postCount = u.postCount - 1
      WHERE
          u.id = :userId
  """)
  @Transactional
  void decrementPostCount(@Param("userId") UUID userId);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.friendsCount = u.friendsCount + 1
      WHERE
          u.id = :userId
  """)
  @Transactional
  void increaseFriendsCount(@Param("userId") UUID userId);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.friendsCount = u.friendsCount - 1
      WHERE
          u.id = :userId
  """)
  @Transactional
  void descreaseFriendsCount(@Param("userId") UUID userId);

  @Query("SELECT u FROM UserEntity u")
  Page<UserEntity> findAllUsersByAdmin(Pageable pageable);

  @Modifying
  @Query(
      value =
          """
      UPDATE UserEntity u
      SET
          u.avatar = :avatar
      WHERE
          u.id = :userId
  """)
  @Transactional
  void updateUserAvatar(@Param("userId") UUID userId, @Param("avatar") String avatar);

  @Modifying
  @Query(
      value =
          """
        UPDATE UserEntity u
        SET
            u.cover = :cover
        WHERE
            u.id = :userId
    """)
  @Transactional
  void updateUserCover(@Param("userId") UUID userId, @Param("cover") String cover);

  Optional<UserEntity> findByEmail(String email);
}
