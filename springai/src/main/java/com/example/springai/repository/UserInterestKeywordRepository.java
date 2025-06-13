package com.example.springai.repository;

import com.example.springai.entity.UserInterestKeyword;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInterestKeywordRepository extends JpaRepository<UserInterestKeyword, Long> {

  @Query(
      value =
          "SELECT CASE WHEN COUNT(uk) > 0 THEN true ELSE false END "
              + "FROM UserInterestKeyword uk "
              + "WHERE uk.userId = :authorId AND uk.keyword = :keyword")
  Boolean existsRecord(@Param("authorId") String authorId, @Param("keyword") String keyword);

  @Query(value = "SELECT uk FROM UserInterestKeyword uk " + "WHERE uk.userId = :userId")
  Optional<UserInterestKeyword> findByUserId(@Param("userId") String userId);
}
