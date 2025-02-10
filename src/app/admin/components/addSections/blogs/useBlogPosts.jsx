'use client';

// useBlogPosts.js
import { useState, useEffect } from 'react';
import { blogPosts } from '@/utils/schema';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';
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
      
      const postsListData = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));

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
      await db.delete(blogPosts).where(eq(blogPosts.id, postId));
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