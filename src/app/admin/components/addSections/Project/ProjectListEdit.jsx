import React from 'react';
import { Pencil, Trash } from 'lucide-react';

const ProjectListEdit = ({ projectList, onEdit, onDelete }) => {
  if (!projectList?.length) {
    return <p className="text-gray-500 italic">No projects found</p>;
  }

  return (
    <div className="space-y-4">
      {projectList.map((project) => (
        <div key={project.id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title">{project.title}</h4>
                <p className="text-base-content/70 mt-1">{project.description}</p>
                <div className="mt-2 text-sm text-base-content/60">
                  <span className="mr-4">Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-sm btn-ghost"
                  onClick={() => {
                    console.log('Edit clicked:', project);
                    onEdit(project);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="btn btn-square btn-sm btn-ghost text-error"
                  onClick={() => onDelete(project.id)}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectListEdit;