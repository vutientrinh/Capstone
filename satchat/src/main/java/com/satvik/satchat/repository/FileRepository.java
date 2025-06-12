package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, UUID> {

  @Query("SELECT f FROM FileEntity f WHERE f.filename = ?1")
  Optional<FileEntity> findByFilename(String filename);

  @Modifying
  @Transactional
  @Query("DELETE FROM FileEntity f WHERE f.filename = ?1")
  void deleteFileByFileName(String filename);
}
