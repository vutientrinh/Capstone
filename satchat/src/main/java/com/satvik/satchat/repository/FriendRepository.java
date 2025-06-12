package com.satvik.satchat.repository;

import com.satvik.satchat.entity.SocialNetwork.FriendEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.model.Enum.EFriend;
import com.satvik.satchat.payload.user.FriendRequestDTO;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends JpaRepository<FriendEntity, UUID> {
  /** PENDING: 0 ACCEPTED: 1 REJECTED: 2 BLOCKED: 3 */
  @Query(
      "SELECT f FROM FriendEntity f WHERE f.requester.id = :requesterId AND f.receiver.id = :receiverId")
  Optional<FriendEntity> existsByRequesterAndReceiver(
      @Param("requesterId") UUID requesterId, @Param("receiverId") UUID receiverId);

  @Modifying
  @Query(
      "DELETE FROM FriendEntity f "
          + "WHERE (f.requester.id = :requesterId AND f.receiver.id = :receiverId) "
          + "OR (f.requester.id = :receiverId AND f.receiver.id = :requesterId)")
  @Transactional
  void deleteByRequesterAndReceiver(
      @Param("requesterId") UUID requesterId, @Param("receiverId") UUID receiverId);

  @Query(
      "SELECT f.receiver FROM FriendEntity f WHERE f.requester.id = :userId AND f.status = :status")
  Page<UserEntity> findAllFriendsById(
      @Param("userId") UUID userId, @Param("status") EFriend status, Pageable pageable);

  @Query(
      "SELECT new com.satvik.satchat.payload.user.FriendRequestDTO(f.id, f.requester) FROM FriendEntity f "
          + "WHERE f.receiver.id = :userId AND f.status = :status")
  Page<FriendRequestDTO> findAllFriendRequestsById(
      @Param("userId") UUID userId, @Param("status") EFriend status, Pageable pageable);

  @Modifying
  @Transactional
  @Query("UPDATE FriendEntity f SET f.status = :status WHERE f.id = :friendRequestId")
  void updateRequestStatus(
      @Param("friendRequestId") UUID friendRequestId, @Param("status") EFriend status);
}
