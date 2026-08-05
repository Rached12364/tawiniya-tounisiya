package tn.tawiniya.tounisiya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.LoginHistory;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    long countBySuccessFalse();
}
