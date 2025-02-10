import React from "react";
import { Globe } from "lucide-react";
import { useConferences } from "./useConferance";
import { ConferenceList } from "./conferanceList";
import { AddConference } from "./addConferance";
import { Toaster } from "react-hot-toast";


export const ConferenceSection = () => {
    const {
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
    } = useConferences();
  
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Conferences
          </h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Conference
          </button>
        </div>
  
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-base-content/60">Loading conferences...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-error">{error}</p>
            <button onClick={getConferencesList} className="btn btn-link mt-2">
              Try again
            </button>
          </div>
        ) : (
          <ConferenceList
            conferencesList={conferencesList}
            onEdit={handleEditConference}
            onDelete={handleDeleteConference}
          />
        )}
  
        {isAddModalOpen && (
          <AddConference
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            editingConference={editingConference}
            onConferenceAdded={handleConferenceAdded}
          />
        )}
        
        <Toaster position="bottom-right" />
      </section>
    );
  };
  