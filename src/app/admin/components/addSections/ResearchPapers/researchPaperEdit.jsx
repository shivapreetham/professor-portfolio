'use client';

import React from 'react';
import { FileEdit, Trash2, FileText, Calendar } from 'lucide-react';

export const ResearchPaperListEdit = ({ papersList, onEdit, onDelete }) => {
  if (!papersList?.length) {
    return <p className="text-gray-500 italic">No research papers found</p>;
  }

  return (
    <div className="space-y-4">
      {papersList.map((paper) => (
        <div key={paper.id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {paper.title}
                </h4>
                <p className="text-base-content/70 mt-2">{paper.abstract}</p>
                <div className="mt-3 flex items-center text-sm text-base-content/60">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Published: {new Date(paper.publishedAt).toLocaleDateString()}</span>
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 flex items-center hover:text-primary"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View PDF
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-sm btn-ghost"
                  onClick={() => onEdit(paper)}
                >
                  <FileEdit className="h-4 w-4" />
                </button>
                <button
                  className="btn btn-square btn-sm btn-ghost text-error"
                  onClick={() => onDelete(paper.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};