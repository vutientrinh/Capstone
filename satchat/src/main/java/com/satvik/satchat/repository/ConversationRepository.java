package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.ConversationEntity;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, UUID> {

  @Query(
      "select c from ConversationEntity c "
          + "where c.toUser = :toUser and c.deliveryStatus "
          + "in ('NOT_DELIVERED', 'DELIVERED') and c.fromUser = :fromUser")
  List<ConversationEntity> findUnseenMessages(
      @Param("toUser") UUID toUser, @Param("fromUser") UUID fromUser);

  @Query(
      value =
          "select * from conversation "
              + "where to_user = :toUser and delivery_status "
              + "in ('NOT_DELIVERED', 'DELIVERED')",
      nativeQuery = true)
  List<ConversationEntity> findUnseenMessagesCount(@Param("toUser") UUID toUser);

  @Query(
      "SELECT c FROM ConversationEntity c "
          + "WHERE ("
          + "       (c.fromUser = :fromUser AND c.toUser = :toUser) OR "
          + "       (c.fromUser = :toUser AND c.toUser = :fromUser)"
          + ") "
          + "AND c.time < ("
          + "    SELECT c2.time FROM ConversationEntity c2 WHERE c2.id = :messageId"
          + ") "
          + "ORDER BY c.time ASC")
  Page<ConversationEntity> getMessagesBefore(
      @Param("fromUser") UUID fromUser,
      @Param("toUser") UUID toUser,
      @Param("messageId") UUID messageId,
      Pageable pageable);

  @Query(
      "SELECT c FROM ConversationEntity c "
          + "WHERE ("
          + "       (c.fromUser = :fromUser AND c.toUser = :toUser) OR "
          + "       (c.fromUser = :toUser AND c.toUser = :fromUser)"
          + ") "
          + "AND c.convId = :convId "
          + "AND c.time < :beforeTime "
          + "ORDER BY c.time ASC")
  Page<ConversationEntity> getMessagesByConvIdBefore(
      @Param("fromUser") UUID fromUser,
      @Param("toUser") UUID toUser,
      @Param("convId") String convId,
      @Param("beforeTime") Timestamp beforeTime,
      Pageable pageable);

  List<ConversationEntity> findByConvId(String convId);
}
