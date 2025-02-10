// hooks/useProjects.js
import { useState, useEffect } from 'react';
import { projects } from '@/utils/schema';
import { db } from '@/utils/db';
import { desc, eq } from 'drizzle-orm';

export const useProjects = () => {
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getProjectList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const projectListData = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt));

      setProjectList(projectListData);
    } catch (error) {
      console.error('Error fetching project list:', error);
      setError('Failed to fetch projects');
      document.getElementById('error-toast')?.showModal();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjectList();
  }, []);

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await db.delete(projects).where(eq(projects.id, projectId));
      document.getElementById('success-toast')?.showModal();
      getProjectList();
    } catch (error) {
      console.error('Error deleting project:', error);
      document.getElementById('error-toast')?.showModal();
    }
  };

  const handleProjectAdded = () => {
    getProjectList();
    setEditingProject(null);
    setIsAddModalOpen(false);
    document.getElementById('success-toast')?.showModal();
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingProject(null);
  };

  return {
    projectList,
    isLoading,
    error,
    editingProject,
    isAddModalOpen,
    handleEditProject,
    handleDeleteProject,
    handleProjectAdded,
    getProjectList,
    openAddModal,
    closeAddModal
  };
};