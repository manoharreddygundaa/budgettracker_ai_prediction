package com.fullStack.expenseTracker.repository;

import com.fullStack.expenseTracker.models.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findAllByOrderByCreatedAtDesc();
    List<ForumPost> findByUserIdOrderByCreatedAtDesc(Long userId);
}