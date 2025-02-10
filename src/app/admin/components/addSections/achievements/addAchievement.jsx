'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { achievements } from '@/utils/schema';
import { toast } from 'react-hot-toast';
import { eq } from 'drizzle-orm';

export const AddAchievement = ({ isOpen, onClose, editingAchievement, onAchievementAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    if (editingAchievement) {
      setFormData({
        title: editingAchievement.title || '',
        description: editingAchievement.description || '',
        date: new Date(editingAchievement.date).toISOString().split('T')[0] || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: ''
      });
    }
  }, [editingAchievement]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.date) {
      toast.error('All fields are required');
      return;
    }

    try {
      if (editingAchievement) {
        await db.update(achievements)
          .set({
            title: formData.title,
            description: formData.description,
            date: new Date(formData.date)
          })
          .where(eq(achievements.id, editingAchievement.id));
        toast.success('Achievement updated successfully!');
      } else {
        await db.insert(achievements).values({
          userId: "1",
          title: formData.title,
          description: formData.description,
          date: new Date(formData.date)
        });
        toast.success('Achievement added successfully!');
      }
      onAchievementAdded();
      onClose();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast.error('Failed to save achievement');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-zinc-900 shadow-lg max-w-full mt-5">
      <div className="card-body  bg-zinc-900 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
          </h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter achievement title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered textarea-sm w-full h-20"
              placeholder="Enter achievement description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Date</span>
            </label>
            <input
              type="date"
              name="date"
              className="input input-sm input-bordered w-full"
              value={formData.date}
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
            >
              {editingAchievement ? 'Save Changes' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAchievement;