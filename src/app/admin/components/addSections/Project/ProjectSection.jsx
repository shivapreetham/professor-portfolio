// components/ProjectSection/index.jsx
import React from 'react';
import AddProject from './AddProject';
import ProjectListEdit from './ProjectListEdit';
import { useProjects } from './useProject';

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

      {/* Toast Modals */}
      <dialog id="error-toast" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box bg-error text-error-content">
          <h3 className="font-bold text-lg">Error</h3>
          <p className="py-4">Failed to complete the operation. Please try again.</p>
          <div className="modal-action">
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>

      <dialog id="success-toast" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box bg-success text-success-content">
          <h3 className="font-bold text-lg">Success</h3>
          <p className="py-4">Operation completed successfully!</p>
          <div className="modal-action">
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </section>
  );
};

export default ProjectSection;