package com.fullStack.expenseTracker.repository;

import com.fullStack.expenseTracker.models.ForumLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ForumLikeRepository extends JpaRepository<ForumLike, Long> {
    Optional<ForumLike> findByPostIdAndUserId(Long postId, Long userId);
    int countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
}
