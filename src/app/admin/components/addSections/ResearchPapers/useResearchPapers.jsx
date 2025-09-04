'use client';
    
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
      
      const response = await fetch('/api/research-papers');
      if (!response.ok) {
        throw new Error('Failed to fetch research papers');
      }
      
      const papersListData = await response.json();
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
      const response = await fetch(`/api/research-papers?id=${paperId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete paper');
      }
      
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
