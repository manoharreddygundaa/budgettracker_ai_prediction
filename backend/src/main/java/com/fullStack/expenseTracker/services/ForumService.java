package com.fullStack.expenseTracker.services;

import com.fullStack.expenseTracker.dto.reponses.ForumCommentResponse;
import com.fullStack.expenseTracker.dto.reponses.ForumPostResponse;
import com.fullStack.expenseTracker.dto.requests.ForumCommentRequest;
import com.fullStack.expenseTracker.dto.requests.ForumPostRequest;
import java.util.List;

public interface ForumService {
    ForumPostResponse createPost(Long userId, ForumPostRequest request);
    List<ForumPostResponse> getAllPosts(Long currentUserId);
    ForumPostResponse getPostById(Long postId, Long currentUserId);
    void deletePost(Long postId, Long userId);
    ForumPostResponse toggleLike(Long postId, Long userId);
    ForumCommentResponse addComment(Long postId, Long userId, ForumCommentRequest request);
    List<ForumCommentResponse> getCommentsByPostId(Long postId);
}
