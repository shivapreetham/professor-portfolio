'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Link2, Camera } from 'lucide-react';
import { db } from '@/utils/db';
import { blogPosts } from '@/utils/schema';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';
import { eq } from 'drizzle-orm';

export const AddBlogPost = ({ isOpen, onClose, editingPost, onPostAdded }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        imageUrl: editingPost.imageUrl || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        imageUrl: ''
      });
    }
  }, [editingPost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadImage(file, {
        bucketName: 'profile-images',
        folderPath: 'blog-posts'
      });

      if (result.success) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      if (editingPost) {
        await db.update(blogPosts)
          .set(formData)
          .where(eq(blogPosts.id, editingPost.id));
        toast.success('Post updated successfully!');
      } else {
        await db.insert(blogPosts).values({
          userId: "1",
          title: formData.title,
          content: formData.content,
          imageUrl: formData.imageUrl || null
        });
        toast.success('Post published successfully!');
      }
      onPostAdded();
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>

          <div className="form-control w-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
            />
            <div 
              className="relative border-2 border-dashed border-accent/30 rounded-lg p-2 cursor-pointer hover:border-accent/50 transition-colors"
              style={{ height: '160px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Blog post featured image"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-6 h-6 opacity-40" />
                  <p className="mt-1 text-xs text-base-content/60">
                    Upload featured image
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Content</span>
            </label>
            <textarea
              name="content"
              className="textarea textarea-bordered w-full h-48"
              placeholder="Write your blog post content..."
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-sm btn-primary"
              disabled={isUploading}
            >
              {isUploading && <span className="loading loading-spinner loading-xs"></span>}
              {editingPost ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};