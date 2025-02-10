import { PenSquare } from "lucide-react";
import React from "react";
import { useBlogPosts } from "./useBlogPosts";
import { AddBlogPost } from "./addBlogPost";
import { BlogPostList } from "./blogPostList";
import { Toaster } from "react-hot-toast";

export const BlogSection = () => {
    const {
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
    } = useBlogPosts();
  
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <PenSquare className="w-6 h-6" />
            Blog Posts
          </h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            New Post
          </button>
        </div>
  
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-base-content/60">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-error">{error}</p>
            <button onClick={getPostsList} className="btn btn-link mt-2">
              Try again
            </button>
          </div>
        ) : (
          <BlogPostList
            postsList={postsList}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        )}
  
        {isAddModalOpen && (
          <AddBlogPost
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            editingPost={editingPost}
            onPostAdded={handlePostAdded}
          />
        )}
        
        <Toaster position="bottom-right" />
      </section>
    );
  };
  