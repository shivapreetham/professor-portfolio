'use client'
import React from 'react';
import { useUser } from './admin/Provider';
import { Mail, Linkedin, MapPin, Download, Youtube } from 'lucide-react';

export default function Home() {
  const userData = useUser();

  if (!userData?.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div data-theme="light" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Always render the image; if profileImage is falsy, use "/avatar.png" */}
          <img 
            src={userData.user.profileImage || "/avatar.png"} 
            alt={userData.user.name}
            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{userData.user.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{userData.user.bio}</p>
            <div className="flex gap-4 flex-wrap">
              {userData.user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.user.location}</span>
                </div>
              )}
              <a 
                href={`mailto:${userData.user.email}`} 
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Mail className="w-4 h-4" />
                <span>{userData.user.email}</span>
              </a>
              {userData.user.linkedIn && (
                <a 
                  href={userData.user.linkedIn} 
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 space-y-16">
        {/* Projects Section */}
        {userData.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Current Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {userData.projects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Always render banner image with a default placeholder */}
                  <img 
                    src={project.banner || "/placeholder.png"} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex gap-4">
                      {project.collaborators && (
                        <p className="text-sm text-gray-500">
                          Collaborators: {project.collaborators}
                        </p>
                      )}
                      {project.videoUrl && (
                        <a 
                          href={project.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Youtube className="w-4 h-4" />
                          Watch Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research Papers */}
        {userData.researchPapers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Research Papers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {userData.researchPapers.map(paper => (
                <div key={paper.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">{paper.title}</h3>
                  <p className="text-gray-600 mb-3">{paper.abstract}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Published: {new Date(paper.publishedAt).toLocaleDateString()}
                    </span>
                    {paper.pdfUrl && (
                      <a 
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {userData.blogPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {userData.blogPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Always render post image with a default placeholder */}
                  <img 
                    src={post.imageUrl || "/placeholder.png"} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards & Achievements */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Insert awards and achievements sections here */}
        </div>
      </main>
    </div>
  );
}
