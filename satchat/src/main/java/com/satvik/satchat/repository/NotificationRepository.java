package com.satvik.satchat.repository;

import com.satvik.satchat.dto.NotificationFilter;
import com.satvik.satchat.entity.SocialNetwork.NotificationEntity;
import com.satvik.satchat.entity.UserEntity;
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
public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {

  @Query("SELECT n FROM NotificationEntity n WHERE n.receiver = :receiver")
  List<NotificationEntity> findAllByReceiver(@Param("receiver") UserEntity receiver);

  @Query(
      """
      SELECT n
      FROM NotificationEntity n
      WHERE n.receiver = :receiver
        AND n.actor <> :receiver
        AND (:#{#filter.messageType} IS NULL OR n.messageType = :#{#filter.messageType})
      ORDER BY n.isRead, n.createdAt DESC
  """)
  Page<NotificationEntity> pagingAllByReceiver(
      @Param("receiver") UserEntity receiver,
      @Param("filter") NotificationFilter filter,
      Pageable pageable);

  @Modifying
  @Query("UPDATE NotificationEntity n SET n.isSent = true WHERE n.id = :notificationId")
  @Transactional
  void setIsSent(@Param("notificationId") UUID notificationId);
}
