package com.satvik.satchat.repository;

import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.entity.Ecommerce.ProductLikedEntity;
import com.satvik.satchat.entity.UserEntity;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductLikedRepository extends JpaRepository<ProductLikedEntity, UUID> {

  @Query("SELECT pl FROM ProductLikedEntity pl WHERE pl.author = :author AND pl.product = :product")
  Optional<ProductLikedEntity> findByAuthorAndProduct(UserEntity author, ProductEntity product);

  @Modifying
  @Transactional
  @Query("DELETE FROM ProductLikedEntity pl WHERE pl.author = :author AND pl.product = :product")
  void removeByAuthorAndProduct(UserEntity author, ProductEntity product);

  @Query("SELECT pl FROM ProductLikedEntity pl WHERE pl.author = :author")
  Page<ProductLikedEntity> findByAuthor(UserEntity author, Pageable pageable);
}
