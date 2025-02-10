'use client';

import { useState, useEffect } from 'react';
import { achievements } from '@/utils/schema';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';
import toast from 'react-hot-toast';

export const useAchievements = () => {
  const [achievementList, setAchievementList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getAchievementList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const achievementListData = await db
        .select()
        .from(achievements)
        .orderBy(desc(achievements.date));

      setAchievementList(achievementListData);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to fetch achievements');
      toast.error('Could not load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAchievementList();
  }, []);

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setIsAddModalOpen(true);
  };

  const handleDeleteAchievement = async (achievementId) => {
    try {
      await db.delete(achievements).where(eq(achievements.id, achievementId));
      toast.success('Achievement deleted successfully');
      getAchievementList();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Failed to delete achievement');
    }
  };

  const handleAchievementAdded = () => {
    getAchievementList();
    setEditingAchievement(null);
    setIsAddModalOpen(false);
  };

  const openAddModal = () => {
    setEditingAchievement(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAchievement(null);
  };

  return {
    achievementList,
    isLoading,
    error,
    editingAchievement,
    isAddModalOpen,
    handleEditAchievement,
    handleDeleteAchievement,
    handleAchievementAdded,
    getAchievementList,
    openAddModal,
    closeAddModal
  };
};