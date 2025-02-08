// src/components/admin/section-editor.tsx
import { useState } from 'react'
import { Edit2, X } from 'lucide-react'

export function SectionEditor({
  title,
  component: FormComponent,
  initialData,
  onSave
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState(initialData)

  const handleSave = async (newData) => {
    await onSave(newData)
    setData(newData)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{title}</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {/* {isEditing ? <X /> : <Edit2 />} */}
        </button>
      </div>

      {isEditing ? (
        <FormComponent data={data} onSubmit={handleSave} />
      ) : (
        <div className="preview">
          {/* Component preview */}
        </div>
      )}
    </div>
  )
}