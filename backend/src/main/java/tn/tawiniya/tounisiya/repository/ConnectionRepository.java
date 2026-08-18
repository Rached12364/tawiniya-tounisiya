package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.tawiniya.tounisiya.entity.Connection;
import tn.tawiniya.tounisiya.entity.ConnectionStatus;
import java.util.List;
import java.util.Optional;
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    Optional<Connection> findByRequesterIdAndReceiverId(Long requesterId, Long receiverId);
    @Query("SELECT c FROM Connection c WHERE c.status = :status AND " +
           "(c.requester.id = :userId OR c.receiver.id = :userId)")
    List<Connection> findAllByUserAndStatus(@Param("userId") Long userId, @Param("status") ConnectionStatus status);
    List<Connection> findByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);
    List<Connection> findByRequesterIdAndStatus(Long requesterId, ConnectionStatus status);
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requester.id = :userId1 AND c.receiver.id = :userId2) OR " +
           "(c.requester.id = :userId2 AND c.receiver.id = :userId1)")
    Optional<Connection> findBetween(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}