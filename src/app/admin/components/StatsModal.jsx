'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Eye, TrendingUp, Users, Calendar, FileText, Award, Presentation, X } from 'lucide-react';
import { useUser } from '../Provider';

const StatsModal = ({ isOpen, onClose }) => {
  const userData = useUser();
  const userInfo = userData?.user;
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalAchievements: 0,
    totalConferences: 0,
    totalBlogs: 0,
    totalResearchPapers: 0,
    portfolioViews: 0,
    isPublished: false,
    lastUpdated: null,
    profileCompletion: 0
  });

  useEffect(() => {
    if (userInfo && userData) {
      const calculateStats = () => {
        const projects = userData.projects?.length || 0;
        const achievements = userData.achievements?.length || 0;
        const conferences = userData.conferences?.length || 0;
        const blogs = userData.blogPosts?.length || 0;
        const researchPapers = userData.researchPapers?.length || 0;

        // Calculate profile completion percentage
        let completionFields = 0;
        let totalFields = 10;

        if (userInfo.name) completionFields++;
        if (userInfo.email) completionFields++;
        if (userInfo.bio) completionFields++;
        if (userInfo.location) completionFields++;
        if (userInfo.linkedIn) completionFields++;
        if (userInfo.profileImage) completionFields++;
        if (projects > 0) completionFields++;
        if (achievements > 0) completionFields++;
        if (userInfo.heroTitle) completionFields++;
        if (userInfo.heroSubtitle) completionFields++;

        const profileCompletion = Math.round((completionFields / totalFields) * 100);

        setStats({
          totalProjects: projects,
          totalAchievements: achievements,
          totalConferences: conferences,
          totalBlogs: blogs,
          totalResearchPapers: researchPapers,
          portfolioViews: Math.floor(Math.random() * 1000) + 50, // Mock data - replace with real analytics
          isPublished: userInfo.isPublished || false,
          lastUpdated: userInfo.updatedAt,
          profileCompletion
        });
      };

      calculateStats();
    }
  }, [userInfo, userData]);

  if (!isOpen) return null;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "primary" }) => (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/70">{title}</p>
            <p className="text-2xl font-bold text-base-content">{value}</p>
            {subtitle && <p className="text-xs text-base-content/60">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h2 className="text-2xl font-bold text-base-content">Portfolio Analytics</h2>
            <p className="text-sm text-base-content/70">Overview of your portfolio performance</p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-circle"
            aria-label="Close stats modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={FileText} 
              title="Projects" 
              value={stats.totalProjects}
              color="primary"
            />
            <StatCard 
              icon={Award} 
              title="Achievements" 
              value={stats.totalAchievements}
              color="success"
            />
            <StatCard 
              icon={Presentation} 
              title="Conferences" 
              value={stats.totalConferences}
              color="info"
            />
            <StatCard 
              icon={Eye} 
              title="Portfolio Views" 
              value={stats.portfolioViews}
              subtitle="Last 30 days"
              color="warning"
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Completion */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
                <div className="flex items-center gap-4">
                  <div className="radial-progress text-primary" style={{"--value": stats.profileCompletion}} role="progressbar">
                    {stats.profileCompletion}%
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-base-content/70">
                      {stats.profileCompletion < 50 ? 'Keep adding content!' : 
                       stats.profileCompletion < 80 ? 'Looking good!' : 'Excellent portfolio!'}
                    </p>
                    <p className="text-xs text-base-content/60">
                      Complete your profile to improve visibility
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Publication Status */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-4">Publication Status</h3>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${stats.isPublished ? 'bg-success/20' : 'bg-warning/20'}`}>
                    <div className={`w-3 h-3 rounded-full ${stats.isPublished ? 'bg-success' : 'bg-warning'}`}></div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {stats.isPublished ? 'Published' : 'Draft Mode'}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {stats.isPublished ? 
                        'Your portfolio is live and visible to others' : 
                        'Your portfolio is private and not visible publicly'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Summary */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Content Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.totalProjects}</p>
                  <p className="text-sm text-base-content/70">Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{stats.totalResearchPapers}</p>
                  <p className="text-sm text-base-content/70">Papers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-info">{stats.totalConferences}</p>
                  <p className="text-sm text-base-content/70">Conferences</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.totalBlogs}</p>
                  <p className="text-sm text-base-content/70">Blog Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">{stats.totalAchievements}</p>
                  <p className="text-sm text-base-content/70">Achievements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded bg-base-300/50">
                  <Calendar className="w-4 h-4 text-base-content/60" />
                  <span className="text-sm text-base-content/80">
                    Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-base-300/50">
                  <TrendingUp className="w-4 h-4 text-base-content/60" />
                  <span className="text-sm text-base-content/80">
                    Portfolio activity: {stats.isPublished ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-300 bg-base-200/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/70">
              Analytics data updates in real-time as you modify your portfolio
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;