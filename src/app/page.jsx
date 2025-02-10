'use client'
import { useUser } from './admin/Provider';
import { Mail, Linkedin, MapPin, Download, Youtube, ExternalLink } from 'lucide-react';

export default function Home() {
  const userData = useUser();
  
  if (!userData?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div data-theme="light" className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[400px] bg-zinc-950 text-primary-content">
        <div className="hero-content flex-col lg:flex-row gap-8 py-12">
          {userData.user.profileImage ? (
            <div className="avatar">
              <div className="w-48 h-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img 
                  src={userData.user.profileImage} 
                  alt={userData.user.name}
                  className="mask mask-circle"
                />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-48">
                <span className="text-4xl">{userData.user.name[0]}</span>
              </div>
            </div>
          )}
          
          <div className="text-center lg:text-left max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">{userData.user.name}</h1>
            <p className="text-xl opacity-90 mb-6">{userData.user.bio}</p>
            <div className="flex flex-wrap gap-4">
              {userData.user.location && (
                <div className="badge badge-lg badge-outline gap-2 p-4">
                  <MapPin className="w-4 h-4" />
                  {userData.user.location}
                </div>
              )}
              <a href={`mailto:${userData.user.email}`} 
                 className="badge badge-lg badge-outline gap-2 p-4 hover:badge-primary transition-colors">
                <Mail className="w-4 h-4" />
                {userData.user.email}
              </a>
              {userData.user.linkedIn && (
                <a href={userData.user.linkedIn} 
                   className="badge badge-lg badge-outline gap-2 p-4 hover:badge-primary transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 space-y-24">
        {/* Projects Section */}
        {userData.projects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">
              Research Projects
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {userData.projects.map(project => (
                <div key={project.id} className="card bg-base-100 shadow-xl group">
                  {project.banner && (
                    <figure className="relative h-56">
                      <img 
                        src={project.banner} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {project.videoUrl && (
                        <a href={project.videoUrl}
                           className="absolute bottom-4 right-4 btn btn-error btn-sm gap-2">
                          <Youtube className="w-4 h-4" />
                          Watch Demo
                        </a>
                      )}
                    </figure>
                  )}
                  <div className="card-body">
                    <h3 className="card-title">{project.title}</h3>
                    <p className="line-clamp-3">{project.description}</p>
                    {project.collaborators && (
                      <div className="flex gap-2 mt-2 text-sm opacity-70">
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
       
        {/* Research Papers */}
        {userData.researchPapers.length > 0 && (
          <section className="bg-base-100 rounded-box p-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Published Research
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {userData.researchPapers.map(paper => (
                <div key={paper.id} className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{paper.title}</h3>
                    <p className="line-clamp-3">{paper.abstract}</p>
                    <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-300">
                      <span className="text-sm opacity-70">
                        {new Date(paper.publishedAt).toLocaleDateString()}
                      </span>
                      {paper.pdfUrl && (
                        <a href={paper.pdfUrl} className="btn btn-primary btn-sm gap-2">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
         {userData.conferences.length > 0 && (
  <section className="py-12">
    <h2 className="text-3xl font-bold text-center mb-12">
      Conference Appearances
    </h2>
    <div className="flex flex-col gap-6">
      {userData.conferences.map((conference) => (
        <div key={conference.id} 
             className="group relative bg-base-100 rounded-lg shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
          <div className="p-6 pl-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {conference.name}
                </h3>
                {conference.paperPresented && (
                  <div className="badge badge-primary mt-2">Paper Presented</div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {conference.location && (
                  <div className="badge badge-lg badge-outline p-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {conference.location}
                  </div>
                )}
                <p className="text-sm opacity-70">
                  {new Date(conference.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
       ))}
      </div>
      </section>)}
        {/* Blog Posts */}
        {userData.blogPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">
              Latest Insights
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userData.blogPosts.map(post => (
                <div key={post.id} className="card bg-base-100 shadow-xl group">
                  {post.imageUrl && (
                    <figure className="h-48">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </figure>
                  )}
                  <div className="card-body">
                    <h3 className="card-title">{post.title}</h3>
                    <p className="line-clamp-3">{post.content}</p>
                    <div className="card-actions justify-between items-center mt-4">
                      <span className="text-sm opacity-70">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <button className="btn btn-ghost btn-sm">Read More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards & Achievements */}
        <div className="grid lg:grid-cols-2 gap-16">
          {userData.awards.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Awards</h2>
              <div className="space-y-6">
                {userData.awards.map(award => (
                  <div key={award.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
                    <div className="card-body">
                      <h3 className="card-title">{award.title}</h3>
                      <p className="text-primary font-medium">{award.organization}</p>
                      <p className="text-sm opacity-70">
                        {new Date(award.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {userData.achievements.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Achievements</h2>
              <div className="space-y-6">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
                    <div className="card-body">
                      <h3 className="card-title">{achievement.title}</h3>
                      <p>{achievement.description}</p>
                      <p className="text-sm opacity-70">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
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