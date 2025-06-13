package com.example.springai.repository;

import com.example.springai.model.User;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
  @Modifying
  @Transactional
  @Query(
      value =
          """
                    INSERT INTO users (
                         id, created_at, updated_at, avatar, bio, cover, email,
                         first_name, follower_count, last_name, password, post_count,
                         status, username, website_url, friends_count
                     ) VALUES (
                         :id, :createdAt, :updatedAt, :avatar, :bio, :cover, :email,
                         :firstName, :followerCount, :lastName, :password, :postCount,
                         :status, :username, :websiteUrl, :friendsCount
                     ) ON DUPLICATE KEY UPDATE
                         updated_at = :updatedAt,
                         avatar = :avatar,
                         bio = :bio,
                         cover = :cover,
                         email = :email,
                         first_name = :firstName,
                         follower_count = :followerCount,
                         last_name = :lastName,
                         password = :password,
                         post_count = :postCount,
                         status = :status,
                         username = :username,
                         website_url = :websiteUrl,
                         friends_count = :friendsCount
                """,
      nativeQuery = true)
  void insertUser(
      @Param("id") String id,
      @Param("createdAt") LocalDateTime createdAt,
      @Param("updatedAt") LocalDateTime updatedAt,
      @Param("avatar") String avatar,
      @Param("bio") String bio,
      @Param("cover") String cover,
      @Param("email") String email,
      @Param("firstName") String firstName,
      @Param("followerCount") Integer followerCount,
      @Param("lastName") String lastName,
      @Param("password") String password,
      @Param("postCount") Integer postCount,
      @Param("status") Integer status,
      @Param("username") String username,
      @Param("websiteUrl") String websiteUrl,
      @Param("friendsCount") Integer friendsCount);

  @Query(
      value = "SELECT keyword FROM user_interest_keywords WHERE user_id = :userId",
      nativeQuery = true)
  String keywordExists(@Param("userId") String userId);
}
