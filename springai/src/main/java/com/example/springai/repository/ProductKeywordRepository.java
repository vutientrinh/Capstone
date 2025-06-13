package com.example.springai.repository;

import com.example.springai.entity.ProductKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductKeywordRepository extends JpaRepository<ProductKeyword, Long> {

  @Query(
      """
          SELECT CASE WHEN COUNT(pk) > 0 THEN TRUE ELSE FALSE END
          FROM ProductKeyword pk
          WHERE pk.productId = :productId
            AND pk.keyword IS NOT NULL
            AND pk.keyword <> ''
      """)
  Boolean isExistKeywords(@Param("productId") String productId);
}
