'use client';
    
import { useState, useEffect } from 'react';
import { researchPapers } from '@/utils/schema';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';

export const useResearchPapers = () => {
  const [papersList, setPapersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPaper, setEditingPaper] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getPapersList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const papersListData = await db
        .select()
        .from(researchPapers)
        .orderBy(desc(researchPapers.publishedAt));

      setPapersList(papersListData);
    } catch (error) {
      console.error('Error fetching papers list:', error);
      setError('Failed to fetch research papers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPapersList();
  }, []);

  const handleEditPaper = (paper) => {
    setEditingPaper(paper);
    setIsAddModalOpen(true);
  };

  const handleDeletePaper = async (paperId) => {
    try {
      await db.delete(researchPapers).where(eq(researchPapers.id, paperId));
      toast.success('Paper deleted successfully!');
      getPapersList();
    } catch (error) {
      console.error('Error deleting paper:', error);
      toast.error('Failed to delete paper');
    }
  };

  const handlePaperAdded = () => {
    getPapersList();
    setEditingPaper(null);
    setIsAddModalOpen(false);
    toast.success('Paper saved successfully!');
  };

  const openAddModal = () => {
    setEditingPaper(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingPaper(null);
  };

  return {
    papersList,
    isLoading,
    error,
    editingPaper,
    isAddModalOpen,
    handleEditPaper,
    handleDeletePaper,
    handlePaperAdded,
    getPapersList,
    openAddModal,
    closeAddModal
  };
};
