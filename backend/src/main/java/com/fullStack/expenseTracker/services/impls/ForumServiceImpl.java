package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.dto.reponses.ForumCommentResponse;
import com.fullStack.expenseTracker.dto.reponses.ForumPostResponse;
import com.fullStack.expenseTracker.dto.requests.ForumCommentRequest;
import com.fullStack.expenseTracker.dto.requests.ForumPostRequest;
import com.fullStack.expenseTracker.models.ForumComment;
import com.fullStack.expenseTracker.models.ForumLike;
import com.fullStack.expenseTracker.models.ForumPost;
import com.fullStack.expenseTracker.models.User;
import com.fullStack.expenseTracker.repository.ForumCommentRepository;
import com.fullStack.expenseTracker.repository.ForumLikeRepository;
import com.fullStack.expenseTracker.repository.ForumPostRepository;
import com.fullStack.expenseTracker.repository.UserRepository;
import com.fullStack.expenseTracker.services.ForumService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ForumServiceImpl implements ForumService {

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private ForumLikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public ForumPostResponse createPost(Long userId, ForumPostRequest request) {
        ForumPost post = new ForumPost();
        post.setUserId(userId);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setLikesCount(0);
        post.setCommentsCount(0);
        
        ForumPost savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost, userId);
    }

    @Override
    public List<ForumPostResponse> getAllPosts(Long currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> mapToPostResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public ForumPostResponse getPostById(Long postId, Long currentUserId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToPostResponse(post, currentUserId);
    }

    @Override
    @Transactional
    public void deletePost(Long postId, Long userId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }
        
        postRepository.delete(post);
    }

    @Override
    @Transactional
    public ForumPostResponse toggleLike(Long postId, Long userId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        boolean alreadyLiked = likeRepository.existsByPostIdAndUserId(postId, userId);
        
        if (alreadyLiked) {
            ForumLike like = likeRepository.findByPostIdAndUserId(postId, userId)
                    .orElseThrow(() -> new RuntimeException("Like not found"));
            likeRepository.delete(like);
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            ForumLike like = new ForumLike();
            like.setPostId(postId);
            like.setUserId(userId);
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }
        
        postRepository.save(post);
        return mapToPostResponse(post, userId);
    }

    @Override
    @Transactional
    public ForumCommentResponse addComment(Long postId, Long userId, ForumCommentRequest request) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        ForumComment comment = new ForumComment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        
        ForumComment savedComment = commentRepository.save(comment);
        
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
        
        return mapToCommentResponse(savedComment);
    }

    @Override
    public List<ForumCommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    private ForumPostResponse mapToPostResponse(ForumPost post, Long currentUserId) {
        User user = userRepository.findById(post.getUserId()).orElse(null);
        boolean isLiked = likeRepository.existsByPostIdAndUserId(post.getPostId(), currentUserId);
        
        return new ForumPostResponse(
                post.getPostId(),
                post.getUserId(),
                user != null ? user.getEmail().split("@")[0] : "Unknown",
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getLikesCount(),
                post.getCommentsCount(),
                isLiked
        );
    }

    private ForumCommentResponse mapToCommentResponse(ForumComment comment) {
        User user = userRepository.findById(comment.getUserId()).orElse(null);
        
        return new ForumCommentResponse(
                comment.getCommentId(),
                comment.getUserId(),
                user != null ? user.getEmail().split("@")[0] : "Unknown",
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
