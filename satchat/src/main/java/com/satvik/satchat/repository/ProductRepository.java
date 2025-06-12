package com.satvik.satchat.repository;

import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {

  @Query(
      """
          SELECT p FROM ProductEntity p
          WHERE p.isDeleted = false
          AND p.visible = true
          AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:category IS NULL OR p.category.name = :category)
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
          AND (:rating <= 0 OR p.rating >= :rating)
          AND (:inStock IS NULL OR
              (:inStock = true AND p.stockQuantity > 0) OR
              (:inStock = false AND p.stockQuantity = 0)
          )
      """)
  Page<ProductEntity> findAllProducts(
      Pageable pageable,
      @Param("search") String search,
      @Param("category") String category,
      @Param("minPrice") BigDecimal minPrice,
      @Param("maxPrice") BigDecimal maxPrice,
      @Param("rating") Integer rating,
      @Param("inStock") Boolean inStock);

  @Query(
      """
          SELECT p FROM ProductEntity p
          WHERE p.isDeleted = false
          AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
      """)
  Page<ProductEntity> getProductAdminPage(Pageable pageable, @Param("search") String search);

  // ADMIN
  @Query("SELECT COUNT(p) FROM ProductEntity p WHERE p.isDeleted = false AND p.visible = true")
  long sellingProducts();

  @Query("SELECT COUNT(p) FROM ProductEntity p WHERE p.isDeleted = false")
  long countProduct();

  @Query(
      """
          SELECT COUNT(p) FROM ProductEntity p
          WHERE p.isDeleted = false
          AND p.visible = false
          AND p.stockQuantity > 0
      """)
  long countVisibleProduct();

  @Query(
      """
          SELECT COUNT(p) FROM ProductEntity p
          WHERE p.isDeleted = false
          AND p.stockQuantity = 0
      """)
  long countOutOfStockProduct();
}
