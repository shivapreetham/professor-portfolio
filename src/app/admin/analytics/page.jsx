'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../Provider';
import {
  BarChart, LineChart, PieChart, Eye, Users, Clock, TrendingUp,
  Globe, Monitor, Smartphone, MousePointer, ArrowUp, ArrowDown,
  Activity, Target, Zap, RefreshCw
} from 'lucide-react';

const AnalyticsPage = () => {
  const userData = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [sectionAnalytics, setSectionAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalytics = async () => {
    if (!userData?.id) return;

    setLoading(true);
    try {
      const [generalRes, sectionRes] = await Promise.all([
        fetch(`/api/analytics/track-view?userId=${userData.id}&days=${timeRange}`),
        fetch(`/api/analytics/section-time?userId=${userData.id}&days=${timeRange}`)
      ]);

      if (generalRes.ok && sectionRes.ok) {
        const generalData = await generalRes.json();
        const sectionData = await sectionRes.json();
        setAnalytics(generalData);
        setSectionAnalytics(sectionData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [userData?.id, timeRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, timeRange, userData?.id]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const StatCard = ({ icon: Icon, title, value, change, trend, color = "primary" }) => (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-base-content/60 mb-1">{title}</p>
            <p className="text-3xl font-bold text-base-content mb-2">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-base-content/60'}`}>
                {trend === 'up' && <ArrowUp className="w-4 h-4" />}
                {trend === 'down' && <ArrowDown className="w-4 h-4" />}
                <span>{change}% vs previous period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-base-content">Analytics Dashboard</h1>
            <p className="text-base-content/60 mt-2">Real-time insights into your portfolio performance</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="join">
              <button
                className={`btn btn-sm join-item ${timeRange === 7 ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTimeRange(7)}
              >
                7 Days
              </button>
              <button
                className={`btn btn-sm join-item ${timeRange === 30 ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTimeRange(30)}
              >
                30 Days
              </button>
              <button
                className={`btn btn-sm join-item ${timeRange === 90 ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTimeRange(90)}
              >
                90 Days
              </button>
            </div>

            <button
              className={`btn btn-sm ${autoRefresh ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>

            <button
              className="btn btn-sm btn-ghost"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Eye}
            title="Total Views"
            value={formatNumber(analytics?.totalViews || 0)}
            change={analytics?.growthRate}
            trend={analytics?.growthRate > 0 ? 'up' : analytics?.growthRate < 0 ? 'down' : 'neutral'}
            color="primary"
          />
          <StatCard
            icon={Users}
            title="Unique Visitors"
            value={formatNumber(analytics?.uniqueVisitors || 0)}
            color="success"
          />
          <StatCard
            icon={Clock}
            title="Avg. Session"
            value={formatTime(analytics?.avgSessionDuration || 0)}
            color="warning"
          />
          <StatCard
            icon={MousePointer}
            title="Interactions"
            value={formatNumber(analytics?.totalInteractions || 0)}
            color="info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Engagement Metrics</h3>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Bounce Rate</span>
                  <div className="flex items-center gap-2">
                    <progress
                      className="progress progress-error w-20"
                      value={analytics?.bounceRate || 0}
                      max="100"
                    ></progress>
                    <span className="text-sm font-medium">{analytics?.bounceRate || 0}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Click-Through Rate</span>
                  <div className="flex items-center gap-2">
                    <progress
                      className="progress progress-success w-20"
                      value={analytics?.clickThroughRate || 0}
                      max="100"
                    ></progress>
                    <span className="text-sm font-medium">{analytics?.clickThroughRate || 0}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Avg. Pages/Session</span>
                  <span className="text-sm font-medium">{analytics?.avgPagesPerSession || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Returning Visitors</span>
                  <span className="text-sm font-medium">{formatNumber(analytics?.returningVisitors || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Device Breakdown</h3>
              <div className="space-y-3 mt-4">
                {Object.entries(analytics?.deviceStats || {}).map(([device, count]) => {
                  const total = Object.values(analytics?.deviceStats || {}).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={device} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                        {device === 'desktop' && <Monitor className="w-4 h-4" />}
                        {device === 'tablet' && <Monitor className="w-4 h-4" />}
                        <span className="text-sm capitalize">{device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <progress
                          className="progress progress-primary w-20"
                          value={percentage}
                          max="100"
                        ></progress>
                        <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Top Countries</h3>
              <div className="space-y-3 mt-4">
                {Object.entries(analytics?.countryStats || {})
                  .sort(([, a], [, b]) => (b.views || b) - (a.views || a))
                  .slice(0, 5)
                  .map(([country, data]) => {
                    const count = data.views || data;
                    return (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">{country}</span>
                        </div>
                        <span className="text-sm font-medium">{count} views</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Section Time Analytics</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Views</th>
                    <th>Avg. Time</th>
                    <th>Total Time</th>
                    <th>Unique Visitors</th>
                    <th>Avg. Scroll Depth</th>
                    <th>Engagement Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionAnalytics?.sectionAnalytics?.map((section) => (
                    <tr key={section.section}>
                      <td className="font-medium capitalize">{section.section}</td>
                      <td>{section.views}</td>
                      <td>{formatTime(section.avgTime)}</td>
                      <td>{formatTime(section.totalTime)}</td>
                      <td>{section.uniqueVisitors}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <progress
                            className="progress progress-success w-16"
                            value={section.avgScrollDepth}
                            max="100"
                          ></progress>
                          <span className="text-sm">{section.avgScrollDepth}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-primary">{section.engagementScore}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Most Popular Sections</h3>
              <div className="space-y-3">
                {sectionAnalytics?.sectionAnalytics?.slice(0, 5).map((section, index) => (
                  <div key={section.section} className="flex items-center gap-3">
                    <div className="badge badge-lg">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{section.section}</span>
                        <span className="text-sm text-base-content/60">{formatTime(section.totalTime)}</span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={section.totalTime}
                        max={sectionAnalytics?.sectionAnalytics?.[0]?.totalTime || 1}
                      ></progress>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {Object.entries(analytics?.referrerStats || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([source, count]) => {
                    const total = Object.values(analytics?.referrerStats || {}).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={source} className="flex items-center gap-3">
                        <Globe className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{source}</span>
                            <span className="text-sm text-base-content/60">{percentage}%</span>
                          </div>
                          <progress
                            className="progress progress-info w-full"
                            value={percentage}
                            max="100"
                          ></progress>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Top Visitor Journeys</h3>
            <div className="space-y-3">
              {sectionAnalytics?.topJourneys?.slice(0, 10).map((journey, index) => (
                <div key={journey.visitorId} className="p-3 bg-base-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Visitor {index + 1}</span>
                    <div className="flex items-center gap-4 text-sm text-base-content/60">
                      <span>{journey.sections} sections</span>
                      <span>{formatTime(journey.totalTime)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {journey.path.map((section, i) => (
                      <React.Fragment key={i}>
                        <div className="badge badge-sm capitalize">{section}</div>
                        {i < journey.path.length - 1 && <span className="text-base-content/40">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-info/10 border border-info/20 shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-info flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-info mb-1">Key Insights</h4>
                <ul className="text-sm text-base-content/80 space-y-1">
                  {sectionAnalytics?.mostPopularSection && (
                    <li>Your most popular section is <strong>{sectionAnalytics.mostPopularSection}</strong></li>
                  )}
                  {sectionAnalytics?.mostEngagingSection && (
                    <li>The most engaging section is <strong>{sectionAnalytics.mostEngagingSection}</strong></li>
                  )}
                  {analytics?.totalViews > 0 && (
                    <li>You have received <strong>{formatNumber(analytics.totalViews)}</strong> total views in the last {timeRange} days</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
