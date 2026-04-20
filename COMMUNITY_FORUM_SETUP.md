# 🎉 Community Forum - Setup Guide

## ✅ What's Implemented

A fully functional community forum with:
- ✅ Create posts
- ✅ Like posts
- ✅ Comment on posts
- ✅ Delete own posts
- ✅ Real-time updates
- ✅ User authentication

## 🚀 Setup Instructions

### Step 1: Create Database Tables

Run this SQL in your MySQL database:

```bash
mysql -u root -p expensetracker < community_forum_schema.sql
```

Or manually run:
```sql
USE expensetracker;

CREATE TABLE IF NOT EXISTS forum_posts (
    post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_comments (
    comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_likes (
    like_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post (user_id, post_id)
);
```

### Step 2: Restart Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Step 3: Restart Frontend

```bash
cd frontend
npm start
```

### Step 4: Test the Forum

1. Navigate to **Community & Forum** in sidebar
2. Click **Forum** tab
3. Click **New Post** button
4. Create a post with title and content
5. Like posts by clicking the heart icon
6. Comment on posts by clicking the comment icon

## 📁 Files Created

### Backend:
- `ForumPost.java` - Post entity model
- `ForumComment.java` - Comment entity model
- `ForumLike.java` - Like entity model
- `ForumPostRepository.java` - Post data access
- `ForumCommentRepository.java` - Comment data access
- `ForumLikeRepository.java` - Like data access
- `ForumService.java` - Service interface
- `ForumServiceImpl.java` - Business logic
- `ForumController.java` - REST API endpoints
- `ForumPostRequest.java` - Request DTO
- `ForumCommentRequest.java` - Request DTO
- `ForumPostResponse.java` - Response DTO
- `ForumCommentResponse.java` - Response DTO

### Frontend:
- Updated `community.js` - Full forum UI
- Updated `userService.js` - API methods

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/mywallet/forum/posts` | Create new post |
| GET | `/mywallet/forum/posts` | Get all posts |
| GET | `/mywallet/forum/posts/{id}` | Get single post |
| DELETE | `/mywallet/forum/posts/{id}` | Delete post |
| POST | `/mywallet/forum/posts/{id}/like` | Toggle like |
| POST | `/mywallet/forum/posts/{id}/comments` | Add comment |
| GET | `/mywallet/forum/posts/{id}/comments` | Get comments |

## 🎨 Features

### Create Post
- Title and content fields
- Validation
- Auto-refresh after creation

### Like System
- Toggle like/unlike
- Real-time count update
- Visual feedback (red heart when liked)

### Comments
- Modal popup for comments
- Add new comments
- Real-time updates
- Shows comment count

### Delete Post
- Only post owner can delete
- Confirmation dialog
- Cascading delete (removes likes and comments)

## 🐛 Troubleshooting

### Issue: "Table doesn't exist"
**Solution:** Run the SQL schema file

### Issue: "401 Unauthorized"
**Solution:** Make sure you're logged in

### Issue: "Posts not loading"
**Solution:** 
1. Check backend is running
2. Check browser console for errors
3. Verify database tables exist

### Issue: "Can't create post"
**Solution:**
1. Check all fields are filled
2. Verify user authentication
3. Check backend logs

## ✨ Next Steps

Now that Forum is complete, we can implement:
1. **Export Data** (PDF/CSV/Excel)
2. **Cloud Backup** (Google Drive/Dropbox)

Let me know when you're ready to implement the next feature!
