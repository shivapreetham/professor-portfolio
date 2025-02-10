'use client'
import { useUser } from './admin/Provider';
import { Mail, Linkedin, MapPin, Download, Youtube, ExternalLink } from 'lucide-react';

export default function Home() {
  const userData = useUser();
  
  if (!userData?.user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div data-theme="light" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {userData.user.profileImage ? (
              <img 
                src={userData.user.profileImage} 
                alt={userData.user.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-4xl text-gray-500">{userData.user.name[0]}</span>
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{userData.user.name}</h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">{userData.user.bio}</p>
              <div className="flex gap-6 flex-wrap justify-center md:justify-start">
                {userData.user.location && (
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.user.location}</span>
                  </div>
                )}
                <a href={`mailto:${userData.user.email}`} 
                   className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>{userData.user.email}</span>
                </a>
                {userData.user.linkedIn && (
                  <a href={userData.user.linkedIn} 
                     className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 space-y-20">
        {/* Projects Section */}
        {userData.projects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Research Projects
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {userData.projects.map(project => (
                <div key={project.id} 
                     className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                  {project.banner && (
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={project.banner} 
                        alt={project.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                      {project.videoUrl && (
                        <a href={project.videoUrl}
                           className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
                          <Youtube className="w-4 h-4" />
                          Watch Demo
                        </a>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    {project.collaborators && (
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="font-medium">Collaborators:</span>
                        <span>{project.collaborators}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research Papers with Cards */}
        {userData.researchPapers.length > 0 && (
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Published Research
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {userData.researchPapers.map(paper => (
                <div key={paper.id} 
                     className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{paper.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{paper.abstract}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Published: {new Date(paper.publishedAt).toLocaleDateString()}
                    </span>
                    {paper.pdfUrl && (
                      <a href={paper.pdfUrl}
                         className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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

        {/* Blog Posts with Modern Cards */}
        {userData.blogPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Latest Insights
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userData.blogPosts.map(post => (
                <div key={post.id} 
                     className="bg-white rounded-xl shadow-lg overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  {post.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{post.content}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards & Achievements in Grid */}
        <div className="grid md:grid-cols-2 gap-16">
          {userData.awards.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Awards
                </span>
              </h2>
              <div className="space-y-6">
                {userData.awards.map(award => (
                  <div key={award.id} 
                       className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{award.title}</h3>
                    <p className="text-blue-600 font-medium">{award.organization}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(award.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {userData.achievements.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Achievements
                </span>
              </h2>
              <div className="space-y-6">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} 
                       className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}