'use client';

// useBlogPosts.js
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useBlogPosts = () => {
  const [postsList, setPostsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getPostsList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const postsListData = await response.json();
      setPostsList(postsListData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostsList();
  }, []);

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsAddModalOpen(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      toast.success('Post deleted successfully!');
      getPostsList();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handlePostAdded = () => {
    getPostsList();
    setEditingPost(null);
    setIsAddModalOpen(false);
    toast.success('Post saved successfully!');
  };

  const openAddModal = () => {
    setEditingPost(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingPost(null);
  };

  return {
    postsList,
    isLoading,
    error,
    editingPost,
    isAddModalOpen,
    handleEditPost,
    handleDeletePost,
    handlePostAdded,
    getPostsList,
    openAddModal,
    closeAddModal
  };
};