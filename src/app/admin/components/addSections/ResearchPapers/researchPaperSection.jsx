'use client';

import React from 'react';
import {AddResearchPaper} from './addResearchPaper';
import {ResearchPaperListEdit} from './researchPaperEdit';
import { useResearchPapers } from './useResearchPapers';
import { Toaster } from 'react-hot-toast';
import { ScrollText } from 'lucide-react';

export const ResearchPaperSection = () => {
  const {
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
  } = useResearchPapers();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ScrollText className="w-6 h-6" />
          Research Papers
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Paper
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading papers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getPapersList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <ResearchPaperListEdit
          papersList={papersList}
          onEdit={handleEditPaper}
          onDelete={handleDeletePaper}
        />
      )}

      {isAddModalOpen && (
        <AddResearchPaper
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingPaper={editingPaper}
          onPaperAdded={handlePaperAdded}
        />
      )}
      
      <Toaster position="bottom-right" />
    </section>
  );
};

export default ResearchPaperSection;