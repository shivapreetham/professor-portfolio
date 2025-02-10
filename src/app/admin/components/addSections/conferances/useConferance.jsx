// useConferences.js
'use client'
import { useState, useEffect } from 'react';
import { conferences } from '@/utils/schema';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';
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
      
      const conferencesListData = await db
        .select()
        .from(conferences)
        .orderBy(desc(conferences.date));

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
      await db.delete(conferences).where(eq(conferences.id, conferenceId));
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
