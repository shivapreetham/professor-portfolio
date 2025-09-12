'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function PreviewPage() {
  const params = useParams()
  const userId = params.id
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
    
    // Listen for refresh messages from parent admin panel
    const handleMessage = (event) => {
      if (event.data?.type === 'REFRESH_DATA') {
        fetchUserData()
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/preview/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Error fetching preview data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p>The requested user profile could not be found.</p>
        </div>
      </div>
    )
  }

  const { user, projects, achievements, conferences, blogPosts } = userData

  return (
    <div className="min-h-screen bg-base-100">
      {/* Preview Banner */}
      <div className="bg-warning text-warning-content p-2 text-center text-sm font-medium">
        🔍 PREVIEW MODE - This is a draft preview, not the published portfolio
      </div>

      {/* Portfolio Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Personal Information */}
        <div className="text-center mb-12">
          {user.profileImage && (
            <div className="avatar mb-6">
              <div className="w-32 rounded-full">
                <img src={user.profileImage} alt={user.name} />
              </div>
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
          <p className="text-xl text-base-content/70 mb-4">{user.email}</p>
          {user.bio && <p className="text-lg mb-4">{user.bio}</p>}
          {user.location && <p className="text-base-content/60">📍 {user.location}</p>}
          {user.linkedIn && (
            <a 
              href={user.linkedIn} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm mt-2"
            >
              LinkedIn
            </a>
          )}
        </div>

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="card bg-base-200 shadow-xl">
                  {project.banner && (
                    <figure>
                      <img src={project.banner} alt={project.title} className="h-48 w-full object-cover" />
                    </figure>
                  )}
                  <div className="card-body">
                    <h3 className="card-title">{project.title}</h3>
                    <p className="text-sm">{project.description}</p>
                    {project.collaborators && (
                      <p className="text-xs text-base-content/60">Collaborators: {project.collaborators}</p>
                    )}
                    {project.videoUrl && (
                      <div className="card-actions">
                        <a href={project.videoUrl} target="_blank" className="btn btn-primary btn-sm">
                          View Demo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title">{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <p className="text-sm text-base-content/60">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conferences Section */}
        {conferences && conferences.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Conferences</h2>
            <div className="space-y-4">
              {conferences.map((conference) => (
                <div key={conference.id} className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title">{conference.name}</h3>
                    {conference.location && <p>📍 {conference.location}</p>}
                    <p className="text-sm text-base-content/60">
                      {new Date(conference.date).toLocaleDateString()}
                    </p>
                    {conference.paperPresented && (
                      <span className="badge badge-success">Paper Presented</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts Section */}
        {blogPosts && blogPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="card bg-base-200 shadow-xl">
                  {post.imageUrl && (
                    <figure>
                      <img src={post.imageUrl} alt={post.title} className="h-48 w-full object-cover" />
                    </figure>
                  )}
                  <div className="card-body">
                    <h3 className="card-title">{post.title}</h3>
                    <p className="text-sm line-clamp-3">{post.content}</p>
                    <p className="text-xs text-base-content/60">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}