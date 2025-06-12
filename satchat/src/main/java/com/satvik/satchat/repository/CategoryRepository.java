package com.satvik.satchat.repository;

import com.satvik.satchat.entity.Ecommerce.CategoryEntity;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, UUID> {

  @Query(
      "SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CategoryEntity c WHERE c.name = ?1")
  boolean existsByName(String name);

  @Modifying
  @Transactional
  @Query("DELETE FROM CategoryEntity c WHERE c = ?1")
  void deleteCategory(CategoryEntity categoryEntity);

  @Query("SELECT c FROM CategoryEntity c")
  Page<CategoryEntity> getCategories(Pageable pageable);
}
