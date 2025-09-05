'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Mail, Linkedin, MapPin, Download, Youtube } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { Section, SectionHeader, SectionContent } from '@/components/ui/section';

export default function PublicPortfolio() {
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchUserData(params.id);
    }
  }, [params.id]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/portfolio/${userId}`);
      if (!response.ok) {
        throw new Error('Portfolio not found');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Portfolio Not Found</h2>
            <p className="text-base-content/60 mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData?.user) {
    return <LoadingSpinner />;
  }

  const sectionsOrder = userData.user.sectionsOrder 
    ? JSON.parse(userData.user.sectionsOrder) 
    : ['projects', 'achievements', 'conferences', 'blogPosts', 'awards'];
    
  const sectionVisibility = userData.user.sectionVisibility 
    ? JSON.parse(userData.user.sectionVisibility) 
    : { projects: true, achievements: true, conferences: true, blogPosts: true, awards: true };

  const renderProjectsSection = () => (
    userData.projects.length > 0 && (
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
    )
  );

  const renderAchievementsSection = () => (
    userData.achievements?.length > 0 && (
      <Section>
        <SectionContent>
          <SectionHeader title="Achievements" subtitle="Notable accomplishments and milestones" />
          <div className="grid lg:grid-cols-2 gap-6">
            {userData.achievements.map(achievement => (
              <Card key={achievement.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <p className="text-base-content/80 mb-3">{achievement.description}</p>
                  <p className="text-sm text-base-content/60">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>
    )
  );

  const renderConferencesSection = () => (
    userData.conferences?.length > 0 && (
      <Section className="bg-base-200">
        <SectionContent>
          <SectionHeader title="Conferences" subtitle="Speaking engagements and presentations" />
          <div className="grid lg:grid-cols-2 gap-6">
            {userData.conferences.map(conference => (
              <Card key={conference.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent>
                  <CardTitle className="text-lg">{conference.name}</CardTitle>
                  <div className="space-y-2 text-sm text-base-content/70">
                    {conference.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {conference.location}
                      </p>
                    )}
                    <p>{new Date(conference.date).toLocaleDateString()}</p>
                    {conference.paperPresented && (
                      <Badge variant="secondary" size="sm">Paper Presented</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>
    )
  );

  const renderBlogPostsSection = () => (
    userData.blogPosts?.length > 0 && (
      <Section>
        <SectionContent>
          <SectionHeader title="Blog Posts" subtitle="Thoughts, insights, and technical articles" />
          <div className="grid lg:grid-cols-2 gap-8">
            {userData.blogPosts.map(post => (
              <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300">
                {post.imageUrl && (
                  <figure className="relative h-56">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </figure>
                )}
                <CardContent>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-base-content/80 line-clamp-3 mb-4">{post.content}</p>
                  <p className="text-sm text-base-content/60">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>
    )
  );

  const renderAwardsSection = () => (
    userData.awards?.length > 0 && (
      <Section className="bg-base-200">
        <SectionContent>
          <SectionHeader title="Awards" subtitle="Recognition and honors received" />
          <div className="grid lg:grid-cols-2 gap-6">
            {userData.awards.map(award => (
              <Card key={award.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent>
                  <CardTitle className="text-lg">{award.title}</CardTitle>
                  <p className="text-base-content/70 mb-2">{award.organization}</p>
                  <p className="text-sm text-base-content/60">
                    {new Date(award.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>
    )
  );

  const sectionComponents = {
    projects: renderProjectsSection,
    achievements: renderAchievementsSection,
    conferences: renderConferencesSection,
    blogPosts: renderBlogPostsSection,
    awards: renderAwardsSection
  };

  const renderSections = () => {
    return sectionsOrder
      .filter(sectionKey => sectionVisibility[sectionKey] && sectionComponents[sectionKey])
      .map(sectionKey => (
        <div key={sectionKey}>
          {sectionComponents[sectionKey]()}
        </div>
      ));
  };

  return (
    <div data-theme={userData.user.theme || "light"} className="min-h-screen bg-base-200">
      {/* Custom CSS injection */}
      {userData.user.customCSS && (
        <style jsx global>{userData.user.customCSS}</style>
      )}
      {/* Navigation */}
      <nav className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <a href="/auth" className="btn btn-ghost text-xl font-bold">
            Portfolio Hub
          </a>
        </div>
        <div className="navbar-end">
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            Create Your Portfolio
          </Button>
        </div>
      </nav>

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
              {userData.user.heroTitle || userData.user.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {userData.user.heroSubtitle || userData.user.bio}
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
        {renderSections()}
      </main>
    </div>
  );
}