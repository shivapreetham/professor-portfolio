'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Link2, Camera } from 'lucide-react';
import { db } from '@/utils/db';
import { projects } from '@/utils/schema';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';
import { eq } from 'drizzle-orm';

const AddProject = ({ isOpen, onClose, editingProject, onProjectAdded }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collaborators: '',
    videoUrl: '',
    banner: ''
  });

  // Load project data into the form when editing
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        collaborators: editingProject.collaborators || '',
        videoUrl: editingProject.videoUrl || '',
        banner: editingProject.banner || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        collaborators: '',
        videoUrl: '',
        banner: ''
      });
    }
  }, [editingProject]);

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
        folderPath: 'projects'
      });

      if (result.success) {
        setFormData((prev) => ({ ...prev, banner: result.url }));
        toast.success('Banner uploaded successfully!');
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

    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      if (editingProject) {
        // Update existing project
        await db.update(projects).set(formData).where(eq(projects.id, editingProject.id));
        toast.success('Project updated successfully!');
      } else {
        // Insert new project (userId is hardcoded for now)
        await db.insert(projects).values({
          userId: "1",
          title: formData.title,
          description: formData.description,
          collaborators: formData.collaborators || null,
          videoUrl: formData.videoUrl || null,
          banner: formData.banner || null
        });
        toast.success('Project added successfully!');
      }
      onProjectAdded();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
      document.getElementById('error-toast')?.showModal();
    }
  };

  return (
    <dialog id="add-project-modal" className="modal" open={isOpen}>
      <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h3>

        {/* Banner Upload */}
        <div className="w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
          />
          <div 
            className="border-2 border-dashed border-secondary/30 rounded-lg p-3 cursor-pointer hover:border-secondary/50 transition-colors aspect-video"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : formData.banner ? (
              <img
                src={formData.banner}
                alt="Project banner"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera className="w-8 h-8 opacity-40" />
                <p className="mt-2 text-xs text-base-content/60">
                  Click to upload banner image
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Title Input */}
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <input
            type="text"
            name="title"
            className="grow"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>

        {/* Description Input */}
        <textarea
          name="description"
          className="textarea textarea-bordered w-full mt-4"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />

        {/* Collaborators Input */}
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <input
            type="text"
            name="collaborators"
            className="grow"
            placeholder="Collaborators (optional)"
            value={formData.collaborators}
            onChange={handleInputChange}
          />
        </label>

        {/* Video URL Input */}
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <Link2 className="w-4 h-4" />
          <input
            type="url"
            name="videoUrl"
            className="grow"
            placeholder="Project Video URL"
            value={formData.videoUrl}
            onChange={handleInputChange}
          />
        </label>

        <div className="modal-action mt-6">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            {editingProject ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default AddProject;
