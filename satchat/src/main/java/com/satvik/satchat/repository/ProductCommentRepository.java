package com.satvik.satchat.repository;

import com.satvik.satchat.entity.Ecommerce.ProductCommentEntity;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCommentRepository extends JpaRepository<ProductCommentEntity, UUID> {
  @Query("SELECT c FROM ProductCommentEntity c WHERE c.product.id = :productId")
  Page<ProductCommentEntity> findAllByProduct(UUID productId, Pageable pageable);

  @Query("SELECT c FROM ProductCommentEntity c WHERE c.product = :productEntity")
  List<ProductCommentEntity> findByProduct(ProductEntity productEntity);

  @Query(
      """
          SELECT c FROM ProductCommentEntity c
          WHERE (:search IS NULL OR LOWER(c.comment) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
  Page<ProductCommentEntity> findProductComments(Pageable pageable, @Param("search") String search);

  @Modifying
  @Transactional
  @Query("DELETE FROM ProductCommentEntity c WHERE c.id = :id")
  void deleteById(UUID id);
}
