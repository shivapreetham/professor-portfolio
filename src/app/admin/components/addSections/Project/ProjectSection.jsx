import React from 'react';
import AddProject from './AddProject';
import ProjectListEdit from './ProjectListEdit';
import { useProjects } from './useProject';
import { Toaster, toast } from 'react-hot-toast';

const ProjectSection = () => {
  const {
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
  } = useProjects();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getProjectList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <ProjectListEdit
          projectList={projectList}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}

      {isAddModalOpen && (
        <AddProject 
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingProject={editingProject}
          onProjectAdded={handleProjectAdded}
        />
      )}
      
      <Toaster position="bottom-right" />
    </section>
  );
};

export default ProjectSection;