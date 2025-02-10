import { Trophy } from "lucide-react";
import React from "react";
import { useAchievements } from "./useAchievement";
import { AddAchievement } from "./addAchievement";
import { AchievementListEdit } from "./achievementListEdit";
import { Toaster } from "react-hot-toast";

export const AchievementsSection = () => {
    const {
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
    } = useAchievements();
  
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Achievements
          </h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            New Achievement
          </button>
        </div>
  
        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-base-content/60">Loading achievements...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-error">{error}</p>
            <button onClick={getAchievementList} className="btn btn-link mt-2">
              Try again
            </button>
          </div>
        ) : (
          <AchievementListEdit
            achievementList={achievementList}
            onEdit={handleEditAchievement}
            onDelete={handleDeleteAchievement}
          />
        )}
  
        {isAddModalOpen && (
          <AddAchievement
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            editingAchievement={editingAchievement}
            onAchievementAdded={handleAchievementAdded}
          />
        )}
        
        <Toaster position="bottom-right" />
      </section>
    );
  };