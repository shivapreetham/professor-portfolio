'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart, 
  Eye, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Award, 
  Presentation, 
  RefreshCw, 
  Globe, 
  Users, 
  MousePointer,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Map,
  Activity,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  ChevronRight
} from 'lucide-react';
import { useUser } from '../Provider';

const ResizableAnalyticsPanel = ({ userInfo, isOpen, onClose }) => {
  const userData = useUser();
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    deviceStats: {},
    countryStats: {},
    browserStats: {},
    osStats: {},
    dailyViews: {},
    recentViews: [],
    topPages: [],
    referrers: {},
    popularSections: [],
    engagementMetrics: {
      clickThroughRate: 0,
      scrollDepth: 0,
      timeOnPage: 0
    }
  });
  const [timeRange, setTimeRange] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleMouseDown = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isResizing && panelRef.current) {
      const newWidth = e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const fetchAnalytics = async () => {
    if (!userInfo?.id) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/analytics/track-view?userId=${userInfo.id}&days=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        
        // Enhanced analytics processing
        const processedData = {
          totalViews: data.totalViews || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          avgSessionDuration: data.avgSessionDuration || 0,
          bounceRate: Math.round((1 - (data.uniqueVisitors / Math.max(data.totalViews, 1))) * 100),
          deviceStats: data.deviceStats || {},
          countryStats: data.countryStats || {},
          browserStats: data.browserStats || {},
          osStats: data.osStats || {},
          dailyViews: data.dailyViews || {},
          recentViews: data.recentViews || [],
          referrers: data.referrers || {},
          engagementMetrics: {
            clickThroughRate: Math.round((data.interactions / Math.max(data.totalViews, 1)) * 100) || 0,
            scrollDepth: data.avgScrollDepth || 0,
            timeOnPage: Math.round(data.avgSessionDuration / 60) || 0
          }
        };
        
        setAnalytics(processedData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen && userInfo) {
      fetchAnalytics();
    }
  }, [isOpen, userInfo, timeRange]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color = "primary" }) => (
    <div className="bg-base-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 text-${color}`} />
            <span className="text-xs font-medium text-base-content/70">{title}</span>
          </div>
          <div className="text-2xl font-bold text-base-content mb-1">{value}</div>
          {subtitle && <div className="text-xs text-base-content/60">{subtitle}</div>}
        </div>
        {trend && (
          <div className={`flex items-center text-xs ${trend > 0 ? 'text-success' : 'text-error'}`}>
            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'behavior', label: 'Behavior', icon: Activity },
    { id: 'technology', label: 'Technology', icon: Monitor },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Resizable Panel */}
      <div 
        ref={panelRef}
        className="fixed top-0 right-0 h-full bg-base-100 shadow-2xl z-50 flex"
        style={{ width: `${width}px` }}
      >
        {/* Resize Handle */}
        <div 
          className="w-1 bg-base-300 hover:bg-primary cursor-ew-resize flex-shrink-0 transition-colors"
          onMouseDown={handleMouseDown}
        >
          <div className="h-full w-full"></div>
        </div>
        
        {/* Panel Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <div>
              <h2 className="text-xl font-bold">Analytics Dashboard</h2>
              <p className="text-sm text-base-content/60">Portfolio performance insights</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Time Range Selector */}
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="select select-sm select-bordered"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
              
              <button
                onClick={fetchAnalytics}
                disabled={isRefreshing}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                ×
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-base-300">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-base-content/70 hover:text-base-content'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard 
                    icon={Eye} 
                    title="Total Views" 
                    value={analytics.totalViews.toLocaleString()}
                    subtitle={`${timeRange} days`}
                    color="primary"
                  />
                  <MetricCard 
                    icon={Users} 
                    title="Unique Visitors" 
                    value={analytics.uniqueVisitors.toLocaleString()}
                    subtitle="individuals"
                    color="success"
                  />
                  <MetricCard 
                    icon={Clock} 
                    title="Avg. Session" 
                    value={formatDuration(analytics.avgSessionDuration)}
                    subtitle="duration"
                    color="info"
                  />
                  <MetricCard 
                    icon={Target} 
                    title="Bounce Rate" 
                    value={`${analytics.bounceRate}%`}
                    subtitle="single page visits"
                    color="warning"
                  />
                </div>

                {/* Daily Views Chart */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Daily Views Trend</h3>
                  <div className="h-32 flex items-end justify-between gap-1">
                    {Object.entries(analytics.dailyViews).slice(-7).map(([date, views]) => (
                      <div key={date} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-primary w-full rounded-t min-h-[4px] transition-all hover:bg-primary/80"
                          style={{ height: `${Math.max((views / Math.max(...Object.values(analytics.dailyViews))) * 100, 5)}%` }}
                        ></div>
                        <span className="text-xs mt-2 text-base-content/60">
                          {new Date(date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <MetricCard 
                    icon={MousePointer} 
                    title="Click Rate" 
                    value={`${analytics.engagementMetrics.clickThroughRate}%`}
                    subtitle="interactions"
                    color="secondary"
                  />
                  <MetricCard 
                    icon={TrendingUp} 
                    title="Scroll Depth" 
                    value={`${analytics.engagementMetrics.scrollDepth}%`}
                    subtitle="avg scroll"
                    color="accent"
                  />
                  <MetricCard 
                    icon={Zap} 
                    title="Time on Page" 
                    value={`${analytics.engagementMetrics.timeOnPage}m`}
                    subtitle="average"
                    color="info"
                  />
                </div>
              </>
            )}

            {activeTab === 'audience' && (
              <>
                {/* Geographic Distribution */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Geographic Distribution
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.countryStats)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)
                      .map(([country, views]) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm">{country || 'Unknown'}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-base-300 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${(views / Math.max(...Object.values(analytics.countryStats))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Visitors */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Visitors</h3>
                  <div className="space-y-3">
                    {analytics.recentViews.slice(0, 10).map((view, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span>{view.country || 'Unknown'}</span>
                          <span className="text-base-content/60">•</span>
                          <span className="capitalize text-base-content/60">{view.device}</span>
                        </div>
                        <span className="text-base-content/60">
                          {new Date(view.viewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Add more tab content for behavior and technology */}
            {activeTab === 'technology' && (
              <>
                {/* Device Breakdown */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Device Usage
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(analytics.deviceStats).map(([device, count]) => {
                      const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
                      return (
                        <div key={device} className="text-center">
                          <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-xs text-base-content/60 capitalize">{device}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResizableAnalyticsPanel;