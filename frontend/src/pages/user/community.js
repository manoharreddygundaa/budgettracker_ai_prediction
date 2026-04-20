import { useState, useEffect } from 'react';
import Header from '../../components/utils/header';
import Container from '../../components/utils/Container';
import toast, { Toaster } from 'react-hot-toast';
import UserService from '../../services/userService';
import AuthService from '../../services/auth.service';
import Loading from '../../components/utils/loading';

function Community() {
    const [activeTab, setActiveTab] = useState('forum');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [exporting, setExporting] = useState(false);
    
    useEffect(() => {
        if (activeTab === 'forum') {
            fetchPosts();
        }
    }, [activeTab]);
    
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await UserService.getAllForumPosts();
            if (response.data.status === 'SUCCESS') {
                setPosts(response.data.response);
            }
        } catch (error) {
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) {
            toast.error('Please fill all fields');
            return;
        }
        try {
            const response = await UserService.createForumPost(newPost);
            if (response.data.status === 'SUCCESS') {
                toast.success('Post created successfully!');
                setNewPost({ title: '', content: '' });
                setShowNewPostForm(false);
                fetchPosts();
            }
        } catch (error) {
            toast.error('Failed to create post');
        }
    };
    
    const handleLike = async (postId) => {
        try {
            const response = await UserService.togglePostLike(postId);
            if (response.data.status === 'SUCCESS') {
                setPosts(posts.map(p => p.postId === postId ? response.data.response : p));
            }
        } catch (error) {
            toast.error('Failed to like post');
        }
    };
    
    const handleViewComments = async (post) => {
        setSelectedPost(post);
        try {
            const response = await UserService.getComments(post.postId);
            if (response.data.status === 'SUCCESS') {
                setComments(response.data.response);
            }
        } catch (error) {
            toast.error('Failed to load comments');
        }
    };
    
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await UserService.addComment(selectedPost.postId, newComment);
            if (response.data.status === 'SUCCESS') {
                setComments([...comments, response.data.response]);
                setNewComment('');
                setPosts(posts.map(p => 
                    p.postId === selectedPost.postId 
                        ? {...p, commentsCount: p.commentsCount + 1} 
                        : p
                ));
            }
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };
    
    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await UserService.deleteForumPost(postId);
            toast.success('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const exportPDF = async () => {
        try {
            const authHeaders = AuthService.authHeader();
            const response = await fetch('http://localhost:8080/api/export/pdf', {
                method: 'GET',
                headers: authHeaders
            });
            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'transactions.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('PDF exported successfully!');
        } catch (error) {
            toast.error('Failed to export PDF');
        }
    };

    const exportCSV = async () => {
        try {
            const authHeaders = AuthService.authHeader();
            const response = await fetch('http://localhost:8080/api/export/csv', {
                method: 'GET',
                headers: authHeaders
            });
            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            const csvData = await response.text();
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'transactions.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('CSV exported successfully!');
        } catch (error) {
            toast.error('Failed to export CSV');
        }
    };



    return (
        <Container activeNavId={14}>
            <Header title="Community Forum & Export " />
            <Toaster />
            
            <div className="community-wrapper">
                <div className="community-tabs">
                    <button 
                        className={activeTab === 'forum' ? 'active' : ''} 
                        onClick={() => setActiveTab('forum')}
                    >
                        <i className="fas fa-comments"></i> Forum
                    </button>
                    <button 
                        className={activeTab === 'export' ? 'active' : ''} 
                        onClick={() => setActiveTab('export')}
                    >
                        <i className="fas fa-download"></i> Export Data
                    </button>
                    <button 
                        className={activeTab === 'backup' ? 'active' : ''} 
                        onClick={() => setActiveTab('backup')}
                    >
                        <i className="fas fa-cloud"></i> Backup
                    </button>
                </div>

                {activeTab === 'forum' && (
                    <div className="forum-section">
                        <div className="forum-header">
                            <h2><i className="fas fa-comments"></i> Community Forum</h2>
                            <button className="btn-new-post" onClick={() => setShowNewPostForm(!showNewPostForm)}>
                                <i className="fas fa-plus"></i> New Post
                            </button>
                        </div>
                        
                        {showNewPostForm && (
                            <div className="new-post-form">
                                <h3>Create New Post</h3>
                                <form onSubmit={handleCreatePost}>
                                    <input
                                        type="text"
                                        placeholder="Post Title"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                        required
                                    />
                                    <textarea
                                        placeholder="Share your thoughts..."
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                        rows="4"
                                        required
                                    />
                                    <div className="form-actions">
                                        <button type="submit" className="btn-submit">Post</button>
                                        <button type="button" className="btn-cancel" onClick={() => setShowNewPostForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                        
                        {loading ? <Loading /> : (
                            <div className="posts-list">
                                {posts.length === 0 ? (
                                    <div className="no-posts">
                                        <i className="fas fa-comments" style={{fontSize: '3rem', opacity: 0.3}}></i>
                                        <p>No posts yet. Be the first to start a discussion!</p>
                                    </div>
                                ) : (
                                    posts.map(post => (
                                        <div key={post.postId} className="post-card">
                                            <div className="post-header">
                                                <div className="post-author">
                                                    <i className="fas fa-user-circle"></i>
                                                    <span>{post.userName}</span>
                                                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {post.userId === AuthService.getCurrentUser().id && (
                                                    <button className="btn-delete" onClick={() => handleDeletePost(post.postId)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                            <h3>{post.title}</h3>
                                            <p>{post.content}</p>
                                            <div className="post-actions">
                                                <button 
                                                    className={`btn-like ${post.isLikedByCurrentUser ? 'liked' : ''}`}
                                                    onClick={() => handleLike(post.postId)}
                                                >
                                                    <i className={`${post.isLikedByCurrentUser ? 'fas' : 'far'} fa-heart`}></i> {post.likesCount}
                                                </button>
                                                <button className="btn-comment" onClick={() => handleViewComments(post)}>
                                                    <i className="fas fa-comment"></i> {post.commentsCount}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        
                        {selectedPost && (
                            <div className="comments-modal" onClick={() => setSelectedPost(null)}>
                                <div className="comments-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h3>Comments</h3>
                                        <button onClick={() => setSelectedPost(null)}><i className="fas fa-times"></i></button>
                                    </div>
                                    <div className="comments-list">
                                        {comments.map(comment => (
                                            <div key={comment.commentId} className="comment">
                                                <div className="comment-author">
                                                    <i className="fas fa-user-circle"></i>
                                                    <span>{comment.userName}</span>
                                                    <span className="comment-date">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleAddComment} className="comment-form">
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <button type="submit"><i className="fas fa-paper-plane"></i></button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'export' && (
                    <div className="export-section">
                        <div className="export-card">
                            <div className="export-header-section">
                                <i className="fas fa-download" style={{fontSize: '3rem', color: '#6366f1'}}></i>
                                <h2>Export Your Data</h2>
                                <p>Download your transaction history in your preferred format</p>
                            </div>

                            <div className="export-form-section">
                                <div className="export-buttons">
                                    <button className="export-btn pdf" onClick={() => exportPDF()}>
                                        <i className="fas fa-file-pdf"></i>
                                        <span>Export as PDF</span>
                                    </button>
                                    <button className="export-btn csv" onClick={() => exportCSV()}>
                                        <i className="fas fa-file-csv"></i>
                                        <span>Export as CSV</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'backup' && (
                    <div className="community-section">
                        <div className="coming-soon-card">
                            <i className="fas fa-cloud-upload-alt" style={{fontSize: '4rem', color: '#f59e0b', marginBottom: '20px'}}></i>
                            <h2>Cloud Backup</h2>
                            <p>Securely backup and restore your financial data to cloud storage.</p>
                            <div className="feature-list">
                                <div className="feature-item">
                                    <i className="fab fa-google-drive"></i>
                                    <span>Google Drive Integration</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fab fa-dropbox"></i>
                                    <span>Dropbox Integration</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-sync"></i>
                                    <span>Automatic backup scheduling</span>
                                </div>
                            </div>
                            <span className="badge">Coming Soon</span>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .community-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .forum-section {
                    max-width: 900px;
                    margin: 0 auto;
                }
                
                .forum-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                
                .forum-header h2 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0;
                }
                
                .btn-new-post {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-new-post:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                }
                
                .new-post-form {
                    background: #ffffff;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    margin-bottom: 24px;
                }
                
                .new-post-form h3 {
                    margin: 0 0 16px 0;
                    color: #1f2937;
                }
                
                .new-post-form input,
                .new-post-form textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    font-size: 1rem;
                    font-family: inherit;
                }
                
                .new-post-form input:focus,
                .new-post-form textarea:focus {
                    outline: none;
                    border-color: #6366f1;
                }
                
                .form-actions {
                    display: flex;
                    gap: 12px;
                }
                
                .btn-submit {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .btn-cancel {
                    background: #f3f4f6;
                    color: #6b7280;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .posts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .post-card {
                    background: #ffffff;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                }
                
                .post-card:hover {
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
                }
                
                .post-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                
                .post-author {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #6b7280;
                    font-size: 0.9rem;
                }
                
                .post-date {
                    color: #9ca3af;
                    font-size: 0.85rem;
                }
                
                .btn-delete {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    padding: 8px;
                }
                
                .post-card h3 {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 12px 0;
                }
                
                .post-card p {
                    color: #4b5563;
                    line-height: 1.6;
                    margin: 0 0 16px 0;
                }
                
                .post-actions {
                    display: flex;
                    gap: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #f3f4f6;
                }
                
                .btn-like, .btn-comment {
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                
                .btn-like i {
                    color: #6b7280;
                }
                
                .btn-like:hover i {
                    color: #ef4444;
                }
                
                .btn-like.liked {
                    color: #ef4444;
                }
                
                .btn-like.liked i {
                    color: #ef4444 !important;
                }
                
                .btn-comment:hover {
                    color: #6366f1;
                }
                
                .no-posts {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6b7280;
                }
                
                .comments-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .comments-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .modal-header h3 {
                    margin: 0;
                    color: #1f2937;
                }
                
                .modal-header button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #6b7280;
                    cursor: pointer;
                }
                
                .comments-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .comment {
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .comment:last-child {
                    border-bottom: none;
                }
                
                .comment-author {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #6b7280;
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                }
                
                .comment-date {
                    color: #9ca3af;
                    font-size: 0.8rem;
                }
                
                .comment p {
                    color: #374151;
                    margin: 0;
                }
                
                .comment-form {
                    display: flex;
                    gap: 12px;
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                }
                
                .comment-form input {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                
                .comment-form button {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .community-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 30px;
                    background: #ffffff;
                    padding: 8px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                .community-tabs button {
                    flex: 1;
                    padding: 14px 24px;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    background: transparent;
                    color: #6b7280;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .community-tabs button:hover {
                    background: rgba(99, 102, 241, 0.1);
                    color: #6366f1;
                }

                .community-tabs button.active {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }

                .community-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 500px;
                }

                .coming-soon-card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 60px 40px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 600px;
                    position: relative;
                }

                .coming-soon-card h2 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1f2937;
                    margin: 0 0 16px 0;
                }

                .coming-soon-card p {
                    font-size: 1.1rem;
                    color: #6b7280;
                    margin-bottom: 32px;
                    line-height: 1.6;
                }

                .feature-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 32px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    background: #f8fafc;
                    border-radius: 10px;
                    text-align: left;
                }

                .feature-item i {
                    font-size: 1.5rem;
                    color: #6366f1;
                }

                .feature-item span {
                    font-weight: 500;
                    color: #374151;
                }

                .badge {
                    display: inline-block;
                    padding: 8px 20px;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
                }

                .export-section {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .export-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                }

                .export-header-section {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                }

                .export-header-section h2 {
                    margin: 16px 0 8px;
                    font-size: 2rem;
                    font-weight: 800;
                }

                .export-header-section p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 1.1rem;
                }

                .export-form-section {
                    padding: 40px;
                }

                .form-group {
                    margin-bottom: 24px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                }

                .form-group select,
                .form-group input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }

                .form-group select:focus,
                .form-group input:focus {
                    outline: none;
                    border-color: #6366f1;
                }

                .date-range {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .export-buttons {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 24px;
                    margin-top: 32px;
                    flex-wrap: wrap;
                }

                .export-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 32px 48px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 600;
                    min-width: 200px;
                }

                .export-btn i {
                    font-size: 2.5rem;
                }

                .export-btn:hover:not(:disabled) {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .export-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .export-btn.pdf {
                    border-color: #ef4444;
                    color: #ef4444;
                }

                .export-btn.pdf:hover:not(:disabled) {
                    background: #fef2f2;
                    border-color: #dc2626;
                }

                .export-btn.csv {
                    border-color: #10b981;
                    color: #10b981;
                }

                .export-btn.csv:hover:not(:disabled) {
                    background: #f0fdf4;
                    border-color: #059669;
                }

                .export-btn.excel {
                    border-color: #22c55e;
                    color: #22c55e;
                }

                .export-btn.excel:hover:not(:disabled) {
                    background: #f0fdf4;
                    border-color: #16a34a;
                }

                @media (max-width: 768px) {
                    .community-tabs {
                        flex-direction: column;
                    }

                    .coming-soon-card {
                        padding: 40px 30px;
                    }

                    .coming-soon-card h2 {
                        font-size: 1.5rem;
                    }

                    .date-range {
                        grid-template-columns: 1fr;
                    }

                    .export-buttons {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </Container>
    );
}

export default Community;
