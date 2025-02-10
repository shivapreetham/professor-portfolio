import React from 'react';
import { Pencil, Trash, Trophy } from 'lucide-react';

export const AchievementListEdit = ({ 
  achievementList, 
  onEdit, 
  onDelete 
}) => {
  if (!achievementList?.length) {
    return (
      <div className="text-center py-8 bg-zinc-300 rounded-lg">
        <Trophy className="w-12 h-12 mx-auto text-base-content/50 mb-4" />
        <p className="text-base-content/60">No achievements added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {achievementList.map((achievement) => (
        <div 
          key={achievement.id} 
          className="card bg-base-300 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="card-title text-lg">{achievement.title}</h3>
                {achievement.description && (
                  <p className="text-base-content/70 mt-2">
                    {achievement.description}
                  </p>
                )}
                <div className="mt-2 text-sm text-base-content/60">
                  {achievement.date && (
                    <span>
                      Achieved on: {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(achievement)}
                  className="btn btn-ghost btn-sm btn-square"
                  aria-label="Edit achievement"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(achievement.id)}
                  className="btn btn-ghost btn-sm btn-square text-error"
                  aria-label="Delete achievement"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};