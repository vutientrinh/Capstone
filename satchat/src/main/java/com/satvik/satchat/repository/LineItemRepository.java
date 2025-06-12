package com.satvik.satchat.repository;

import com.satvik.satchat.entity.Ecommerce.LineItemEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LineItemRepository extends JpaRepository<LineItemEntity, UUID> {}
