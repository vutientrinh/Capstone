package com.example.springai.repository;

import com.example.springai.model.Product;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
  @Modifying
  @Transactional
  @Query(
      value =
          """
                INSERT INTO products (
                    id, created_at, updated_at, currency, description, height, is_deleted, is_liked,
                    length, name, price, rating, sales_count, stock_quantity, visible, weight, width, category
                ) VALUES (
                    :id, :createdAt, :updatedAt, :currency, :description, :height, :isDeleted, :isLiked,
                    :length, :name, :price, :rating, :salesCount, :stockQuantity, :visible, :weight, :width, :category
                ) ON DUPLICATE KEY UPDATE
                    updated_at = :updatedAt,
                    name = :name,
                    description = :description,
                    price = :price,
                    stock_quantity = :stockQuantity,
                    currency = :currency,
                    height = :height,
                    length = :length,
                    weight = :weight,
                    width = :width,
                    rating = :rating,
                    sales_count = :salesCount,
                    is_deleted = :isDeleted,
                    visible = :visible,
                    category = :category
                """,
      nativeQuery = true)
  void insertProduct(
      @Param("id") String id,
      @Param("createdAt") LocalDateTime createdAt,
      @Param("updatedAt") LocalDateTime updatedAt,
      @Param("currency") Integer currency,
      @Param("description") String description,
      @Param("height") BigDecimal height,
      @Param("isDeleted") Boolean isDeleted,
      @Param("isLiked") Boolean isLiked,
      @Param("length") BigDecimal length,
      @Param("name") String name,
      @Param("price") BigDecimal price,
      @Param("rating") BigDecimal rating,
      @Param("salesCount") Integer salesCount,
      @Param("stockQuantity") Integer stockQuantity,
      @Param("visible") Boolean visible,
      @Param("weight") BigDecimal weight,
      @Param("width") BigDecimal width,
      @Param("category") String category);

  @Query(
      value = "SELECT keyword FROM product_keywords WHERE product_id = :productId",
      nativeQuery = true)
  String getKeywordsByProductId(@Param("productId") String productId);
}
