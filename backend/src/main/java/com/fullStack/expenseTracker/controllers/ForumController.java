package com.fullStack.expenseTracker.controllers;

import com.fullStack.expenseTracker.dto.reponses.ApiResponseDto;
import com.fullStack.expenseTracker.dto.reponses.ForumCommentResponse;
import com.fullStack.expenseTracker.dto.reponses.ForumPostResponse;
import com.fullStack.expenseTracker.dto.requests.ForumCommentRequest;
import com.fullStack.expenseTracker.dto.requests.ForumPostRequest;
import com.fullStack.expenseTracker.enums.ApiResponseStatus;
import com.fullStack.expenseTracker.security.UserDetailsImpl;
import com.fullStack.expenseTracker.services.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/mywallet/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @PostMapping("/posts")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<ForumPostResponse>> createPost(
            @RequestBody ForumPostRequest request,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ForumPostResponse post = forumService.createPost(userDetails.getId(), request);
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }

    @GetMapping("/posts")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<List<ForumPostResponse>>> getAllPosts(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<ForumPostResponse> posts = forumService.getAllPosts(userDetails.getId());
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, posts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }
    @GetMapping("/posts/{postId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<ForumPostResponse>> getPost(
            @PathVariable Long postId,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ForumPostResponse post = forumService.getPostById(postId, userDetails.getId());
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }
    @DeleteMapping("/posts/{postId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<String>> deletePost(
            @PathVariable Long postId,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            forumService.deletePost(postId, userDetails.getId());
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, "Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, e.getMessage()));
        }
    }

    @PostMapping("/posts/{postId}/like")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<ForumPostResponse>> toggleLike(
            @PathVariable Long postId,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ForumPostResponse post = forumService.toggleLike(postId, userDetails.getId());
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }
    @PostMapping("/posts/{postId}/comments")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<ForumCommentResponse>> addComment(
            @PathVariable Long postId,
            @RequestBody ForumCommentRequest request,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ForumCommentResponse comment = forumService.addComment(postId, userDetails.getId(), request);
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }

    @GetMapping("/posts/{postId}/comments")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApiResponseDto<List<ForumCommentResponse>>> getComments(@PathVariable Long postId) {
        try {
            List<ForumCommentResponse> comments = forumService.getCommentsByPostId(postId);
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, comments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }
}
