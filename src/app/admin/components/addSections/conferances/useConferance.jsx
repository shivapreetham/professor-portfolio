// useConferences.js
'use client'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useConferences = () => {
  const [conferencesList, setConferencesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingConference, setEditingConference] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getConferencesList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/conferences');
      if (!response.ok) {
        throw new Error('Failed to fetch conferences');
      }
      
      const conferencesListData = await response.json();
      setConferencesList(conferencesListData);
    } catch (error) {
      console.error('Error fetching conferences list:', error);
      setError('Failed to fetch conferences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConferencesList();
  }, []);

  const handleEditConference = (conference) => {
    setEditingConference(conference);
    setIsAddModalOpen(true);
  };

  const handleDeleteConference = async (conferenceId) => {
    try {
      const response = await fetch('/api/conferences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: conferenceId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete conference');
      }
      
      toast.success('Conference deleted successfully!');
      getConferencesList();
    } catch (error) {
      console.error('Error deleting conference:', error);
      toast.error('Failed to delete conference');
    }
  };

  const handleConferenceAdded = () => {
    getConferencesList();
    setEditingConference(null);
    setIsAddModalOpen(false);
    toast.success('Conference saved successfully!');
  };

  const openAddModal = () => {
    setEditingConference(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingConference(null);
  };

  return {
    conferencesList,
    isLoading,
    error,
    editingConference,
    isAddModalOpen,
    handleEditConference,
    handleDeleteConference,
    handleConferenceAdded,
    getConferencesList,
    openAddModal,
    closeAddModal
  };
};
