'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Eye, TrendingUp, Calendar, FileText, Award, Presentation, RefreshCw, Globe, Users, MousePointer } from 'lucide-react';
import { useUser } from '../Provider';

const StatsPanel = ({ userInfo }) => {
  const userData = useUser();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalAchievements: 0,
    totalConferences: 0,
    totalBlogs: 0,
    totalResearchPapers: 0,
    portfolioViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    isPublished: false,
    lastUpdated: null,
    profileCompletion: 0,
    deviceStats: {},
    countryStats: {},
    recentViews: []
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateStats = async () => {
    if (userInfo && userData) {
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

      // Fetch real analytics data
      let analyticsStats = {
        portfolioViews: 0,
        uniqueVisitors: 0,
        avgSessionDuration: 0,
        deviceStats: {},
        countryStats: {},
        recentViews: []
      };

      try {
        const response = await fetch(`/api/analytics/track-view?userId=${userInfo.id}&days=30`);
        if (response.ok) {
          const analytics = await response.json();
          analyticsStats = analytics;
          setAnalyticsData(analytics);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }

      setStats({
        totalProjects: projects,
        totalAchievements: achievements,
        totalConferences: conferences,
        totalBlogs: blogs,
        totalResearchPapers: researchPapers,
        portfolioViews: analyticsStats.totalViews || 0,
        uniqueVisitors: analyticsStats.uniqueVisitors || 0,
        avgSessionDuration: analyticsStats.avgSessionDuration || 0,
        deviceStats: analyticsStats.deviceStats || {},
        countryStats: analyticsStats.countryStats || {},
        recentViews: analyticsStats.recentViews || [],
        isPublished: userInfo.isPublished || false,
        lastUpdated: userInfo.updatedAt,
        profileCompletion
      });
    }
  };

  useEffect(() => {
    calculateStats();
  }, [userInfo, userData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      calculateStats();
      setIsRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "primary" }) => (
    <div className="card bg-base-300/50 shadow-sm">
      <div className="card-body p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/70">{title}</p>
            <p className="text-lg font-bold text-base-content">{value}</p>
            {subtitle && <p className="text-xs text-base-content/60">{subtitle}</p>}
          </div>
          <Icon className={`w-4 h-4 text-${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-base-content">Portfolio Overview</h4>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn btn-ghost btn-circle btn-xs"
          aria-label="Refresh stats"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard 
          icon={Eye} 
          title="Total Views" 
          value={stats.portfolioViews}
          subtitle="30 days"
          color="primary"
        />
        <StatCard 
          icon={Users} 
          title="Visitors" 
          value={stats.uniqueVisitors}
          subtitle="unique"
          color="success"
        />
        <StatCard 
          icon={FileText} 
          title="Content" 
          value={stats.totalProjects + stats.totalAchievements + stats.totalConferences}
          subtitle="items"
          color="info"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Avg. Time" 
          value={`${Math.floor(stats.avgSessionDuration / 60)}m`}
          subtitle="session"
          color="warning"
        />
      </div>

      {/* Profile Completion */}
      <div className="card bg-base-300/30 shadow-sm">
        <div className="card-body p-3">
          <h5 className="text-sm font-medium mb-2">Profile Completion</h5>
          <div className="flex items-center gap-3">
            <div className="radial-progress text-primary text-sm" style={{"--value": stats.profileCompletion, "--size": "2.5rem", "--thickness": "3px"}} role="progressbar">
              <span className="text-xs">{stats.profileCompletion}%</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-base-content/80">
                {stats.profileCompletion < 50 ? 'Keep adding content!' : 
                 stats.profileCompletion < 80 ? 'Looking great!' : 'Excellent!'}
              </p>
              <div className="w-full bg-base-content/10 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                  style={{width: `${stats.profileCompletion}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publication Status */}
      <div className="card bg-base-300/30 shadow-sm">
        <div className="card-body p-3">
          <h5 className="text-sm font-medium mb-2">Status</h5>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${stats.isPublished ? 'bg-success' : 'bg-warning'}`}></div>
            <div className="flex-1">
              <p className="text-xs font-medium text-base-content">
                {stats.isPublished ? 'Published' : 'Draft Mode'}
              </p>
              <p className="text-xs text-base-content/70">
                {stats.isPublished ? 'Live & visible' : 'Private portfolio'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Breakdown */}
      <div className="card bg-base-300/30 shadow-sm">
        <div className="card-body p-3">
          <h5 className="text-sm font-medium mb-2">Content Summary</h5>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-base-content/70">Research Papers</span>
              <span className="font-medium">{stats.totalResearchPapers}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-base-content/70">Blog Posts</span>
              <span className="font-medium">{stats.totalBlogs}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-base-content/70">Total Content</span>
              <span className="font-medium text-primary">
                {stats.totalProjects + stats.totalAchievements + stats.totalConferences + stats.totalBlogs + stats.totalResearchPapers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-300/30 shadow-sm">
        <div className="card-body p-3">
          <h5 className="text-sm font-medium mb-2">Recent Activity</h5>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-base-content/80">
              <Calendar className="w-3 h-3" />
              <span>
                Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-base-content/80">
              <TrendingUp className="w-3 h-3" />
              <span>Activity: {stats.isPublished ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      {Object.keys(stats.deviceStats).length > 0 && (
        <div className="card bg-base-300/30 shadow-sm">
          <div className="card-body p-3">
            <h5 className="text-sm font-medium mb-2">Device Breakdown</h5>
            <div className="space-y-1">
              {Object.entries(stats.deviceStats).map(([device, count]) => (
                <div key={device} className="flex justify-between text-xs">
                  <span className="text-base-content/70 capitalize">{device}</span>
                  <span className="font-medium">{count} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Countries */}
      {Object.keys(stats.countryStats).length > 0 && (
        <div className="card bg-base-300/30 shadow-sm">
          <div className="card-body p-3">
            <h5 className="text-sm font-medium mb-2">Top Countries</h5>
            <div className="space-y-1">
              {Object.entries(stats.countryStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([country, count]) => (
                <div key={country} className="flex justify-between text-xs">
                  <span className="text-base-content/70">{country || 'Unknown'}</span>
                  <span className="font-medium">{count} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.recentViews.length > 0 && (
        <div className="card bg-base-300/30 shadow-sm">
          <div className="card-body p-3">
            <h5 className="text-sm font-medium mb-2">Recent Visitors</h5>
            <div className="space-y-2">
              {stats.recentViews.slice(0, 3).map((view, index) => (
                <div key={index} className="text-xs text-base-content/80">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>{view.country || 'Unknown'}</span>
                    <span className="text-base-content/50">•</span>
                    <span className="capitalize">{view.device}</span>
                  </div>
                  <div className="text-base-content/60 ml-4">
                    {new Date(view.viewedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-info/10 border border-info/20 shadow-sm">
        <div className="card-body p-3">
          <h5 className="text-sm font-medium text-info mb-1">💡 Insight</h5>
          <p className="text-xs text-base-content/80">
            {stats.portfolioViews === 0 ? 
              'No views yet. Share your portfolio to get started!' :
              stats.uniqueVisitors > 0 ? 
                `You have ${stats.uniqueVisitors} unique visitors this month!` :
                stats.profileCompletion < 70 ? 
                  'Complete your profile to attract more visitors!' :
                  'Great job! Your portfolio is getting attention.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;