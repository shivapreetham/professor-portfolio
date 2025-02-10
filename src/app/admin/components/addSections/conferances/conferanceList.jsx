import { Globe, Calendar, Check, FileEdit, Trash2 } from "lucide-react";


export const ConferenceList = ({ conferencesList, onEdit, onDelete }) => {
    if (!conferencesList?.length) {
      return <p className="text-gray-500 italic">No conferences found</p>;
    }
  
    return (
      <div className="space-y-4">
        {conferencesList.map((conference) => (
          <div key={conference.id} className="card bg-base-500 shadow-xl">
            <div className="card-body bg-zinc-900 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="card-title flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {conference.name}
                  </h4>
                  <p className="text-base-content/70 mt-2">{conference.location}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-base-content/60">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(conference.date).toLocaleDateString()}</span>
                    </div>
                    {conference.paperPresented && (
                      <div className="flex items-center text-success">
                        <Check className="w-4 h-4 mr-1" />
                        <span>Paper Presented</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-square btn-sm btn-ghost"
                    onClick={() => onEdit(conference)}
                  >
                    <FileEdit className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-square btn-sm btn-ghost text-error"
                    onClick={() => onDelete(conference.id)}
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