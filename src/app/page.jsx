'use client'
import { useUser } from './admin/Provider';
import { Mail, Linkedin, MapPin, Download, Youtube, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { Section, SectionHeader, SectionContent } from '@/components/ui/section';

export default function Home() {
  const userData = useUser();
  
  if (!userData?.user) {
    return <LoadingSpinner />;
  }

  return (
    <div data-theme="light" className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[500px] hero-gradient text-primary-content relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="hero-content flex-col lg:flex-row gap-12 py-16 relative z-10">
          {userData.user.profileImage ? (
            <div className="avatar animate-pulse">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full ring-4 ring-white/30 ring-offset-4 ring-offset-transparent shadow-2xl">
                <img 
                  src={userData.user.profileImage} 
                  alt={userData.user.name}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder animate-pulse">
              <div className="bg-white/20 text-white rounded-full w-48 h-48 lg:w-56 lg:h-56 ring-4 ring-white/30 ring-offset-4 ring-offset-transparent shadow-2xl">
                <span className="text-5xl lg:text-6xl font-bold">{userData.user.name[0]}</span>
              </div>
            </div>
          )}
          
          <div className="text-center lg:text-left max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {userData.user.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {userData.user.bio}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {userData.user.location && (
                <Badge variant="outline" size="lg" className="gap-2 p-4 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                  {userData.user.location}
                </Badge>
              )}
              <a href={`mailto:${userData.user.email}`}>
                <Badge variant="outline" size="lg" className="gap-2 p-4 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <Mail className="w-4 h-4" />
                  {userData.user.email}
                </Badge>
              </a>
              {userData.user.linkedIn && (
                <a href={userData.user.linkedIn} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" size="lg" className="gap-2 p-4 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Badge>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="space-y-24">
        {/* Projects Section */}
        {userData.projects.length > 0 && (
          <Section className="bg-base-200">
            <SectionContent>
              <SectionHeader title="Research Projects" subtitle="Explore my latest research and development projects" />
            <div className="grid lg:grid-cols-2 gap-8">
              {userData.projects.map(project => (
                <Card key={project.id} className="group hover:shadow-2xl transition-all duration-300">
                  {project.banner && (
                    <figure className="relative h-56">
                      <img 
                        src={project.banner} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {project.videoUrl && (
                        <a href={project.videoUrl} target="_blank" rel="noopener noreferrer"
                           className="absolute bottom-4 right-4">
                          <Button variant="error" size="sm" className="gap-2">
                            <Youtube className="w-4 h-4" />
                            Watch Demo
                          </Button>
                        </a>
                      )}
                    </figure>
                  )}
                  <CardContent>
                    <CardTitle>{project.title}</CardTitle>
                    <p className="text-base-content/80 line-clamp-3 mb-4">{project.description}</p>
                    {project.collaborators && (
                      <div className="flex gap-2 text-sm text-base-content/70">
                        <span className="font-medium">Collaborators:</span>
                        <span>{project.collaborators}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            </SectionContent>
          </Section>
        )}
       
        {/* Research Papers */}
        {userData.researchPapers.length > 0 && (
          <Section>
            <SectionContent>
              <SectionHeader title="Published Research" subtitle="Academic papers and publications" />
            <div className="grid lg:grid-cols-2 gap-8">
              {userData.researchPapers.map(paper => (
                <Card key={paper.id} className="bg-base-100 hover:shadow-xl transition-all duration-300">
                  <CardContent>
                    <CardTitle className="mb-3">{paper.title}</CardTitle>
                    <p className="text-base-content/80 line-clamp-4 mb-4">{paper.abstract}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-base-300">
                      <span className="text-sm text-base-content/60">
                        {new Date(paper.publishedAt).toLocaleDateString()}
                      </span>
                      {paper.pdfUrl && (
                        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="primary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </SectionContent>
          </Section>
        )}
         {userData.conferences.length > 0 && (
  <Section className="bg-base-100">
    <SectionContent>
      <SectionHeader title="Conference Appearances" subtitle="Speaking engagements and academic presentations" />
    <div className="flex flex-col gap-6">
      {userData.conferences.map((conference) => (
        <Card key={conference.id} className="group relative hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-lg"></div>
          <CardContent className="pl-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {conference.name}
                </h3>
                {conference.paperPresented && (
                  <Badge variant="primary" className="mt-2">Paper Presented</Badge>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {conference.location && (
                  <Badge variant="outline" size="lg" className="p-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {conference.location}
                  </Badge>
                )}
                <p className="text-sm text-base-content/60">
                  {new Date(conference.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
       ))}
      </div>
      </SectionContent>
    </Section>)}
        {/* Blog Posts */}
        {userData.blogPosts.length > 0 && (
          <Section className="bg-base-200">
            <SectionContent>
              <SectionHeader title="Latest Insights" subtitle="Thoughts, ideas, and updates from my work" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userData.blogPosts.map(post => (
                <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300">
                  {post.imageUrl && (
                    <figure className="h-48">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </figure>
                  )}
                  <CardContent>
                    <CardTitle className="mb-3">{post.title}</CardTitle>
                    <p className="text-base-content/80 line-clamp-3 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-base-300">
                      <span className="text-sm text-base-content/60">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm">Read More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </SectionContent>
          </Section>
        )}

        {/* Awards & Achievements */}
        <Section>
          <SectionContent>
            <div className="grid lg:grid-cols-2 gap-16">
              {userData.awards.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-center lg:text-left">Awards</h2>
              <div className="space-y-6">
                {userData.awards.map(award => (
                  <Card key={award.id} className="hover:shadow-xl transition-all duration-300">
                    <CardContent>
                      <CardTitle className="mb-2">{award.title}</CardTitle>
                      <p className="text-primary font-medium mb-2">{award.organization}</p>
                      <p className="text-sm text-base-content/60">
                        {new Date(award.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
                </div>
          )}

              {userData.achievements.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-center lg:text-left">Achievements</h2>
                  <div className="space-y-6">
                    {userData.achievements.map(achievement => (
                      <Card key={achievement.id} className="hover:shadow-xl transition-all duration-300">
                        <CardContent>
                          <CardTitle className="mb-3">{achievement.title}</CardTitle>
                          <p className="text-base-content/80 mb-3">{achievement.description}</p>
                          <p className="text-sm text-base-content/60">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionContent>
        </Section>
      </main>
    </div>
  );
}