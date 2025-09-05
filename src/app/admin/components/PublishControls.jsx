'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

export default function PublishControls() {
  const { user } = useAuth()
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check current publish status
  useEffect(() => {
    if (user) {
      setIsPublished(user.isPublished || false)
    }
  }, [user])

  const handleTogglePublish = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !isPublished
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update publish status')
      }

      const data = await response.json()
      setIsPublished(data.isPublished)
      toast.success(data.message)
    } catch (error) {
      console.error('Error updating publish status:', error)
      toast.error('Failed to update publish status')
    } finally {
      setLoading(false)
    }
  }

  const portfolioUrl = `${window.location.origin}/portfolio/${user?.id}`

  return (
    <div className="card bg-base-200 shadow-lg mb-6">
      <div className="card-body p-4">
        <h3 className="card-title text-lg">Portfolio Status</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`badge ${isPublished ? 'badge-success' : 'badge-warning'}`}>
              {isPublished ? 'Published' : 'Draft'}
            </div>
            <span className="text-sm text-base-content/60">
              {isPublished 
                ? 'Your portfolio is live and visible to everyone' 
                : 'Your portfolio is in draft mode'}
            </span>
          </div>
          
          <button
            onClick={handleTogglePublish}
            disabled={loading}
            className={`btn btn-sm ${isPublished ? 'btn-warning' : 'btn-success'}`}
          >
            {loading && <span className="loading loading-spinner loading-xs"></span>}
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>

        {isPublished && (
          <div className="mt-4 p-3 bg-base-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Public URL:</p>
                <p className="text-xs text-base-content/60 break-all">
                  {portfolioUrl}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(portfolioUrl)
                  toast.success('URL copied to clipboard!')
                }}
                className="btn btn-xs btn-outline"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="divider my-2"></div>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/preview/${user?.id}`, '_blank')}
            className="btn btn-sm btn-outline flex-1"
          >
            Preview
          </button>
          {isPublished && (
            <button
              onClick={() => window.open(portfolioUrl, '_blank')}
              className="btn btn-sm btn-primary flex-1"
            >
              View Live
            </button>
          )}
        </div>
      </div>
    </div>
  )
}