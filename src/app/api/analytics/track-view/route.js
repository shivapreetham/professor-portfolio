import { db, withRetry } from '@/utils/db';
import { portfolioViews, visitorSessions, portfolioAnalytics } from '@/utils/schema';
import { eq, and, gte, lt, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Helper function to get geolocation from IP
async function getGeoLocation(ip) {
    if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
        return { country: 'Unknown', city: 'Unknown' };
    }
    
    try {
        // Using free ip-api.com service (100 requests/min limit)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,query`);
        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
                return {
                    country: data.country || 'Unknown',
                    city: data.city || 'Unknown'
                };
            }
        }
    } catch (error) {
        console.error('Geolocation error:', error);
    }
    
    return { country: 'Unknown', city: 'Unknown' };
}

// Helper function to extract visitor info
async function extractVisitorInfo(request) {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
    
    // Get geolocation
    const geoData = await getGeoLocation(ipAddress);
    
    // Basic device detection
    let device = 'desktop';
    if (/mobile/i.test(userAgent)) device = 'mobile';
    else if (/tablet/i.test(userAgent)) device = 'tablet';
    
    // Basic browser detection
    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    // Basic OS detection
    let os = 'unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    return { 
        userAgent, 
        ipAddress, 
        device, 
        browser, 
        os, 
        country: geoData.country,
        city: geoData.city
    };
}

export async function POST(request) {
    try {
        const { userId, visitorId, referrer, sessionDuration } = await request.json();
        
        if (!userId || !visitorId) {
            return NextResponse.json({ error: 'UserId and visitorId are required' }, { status: 400 });
        }

        const visitorInfo = await extractVisitorInfo(request);

        // Track the view
        await withRetry(async () => {
            // Insert portfolio view
            await db.insert(portfolioViews).values({
                userId,
                visitorId,
                referrer,
                sessionDuration,
                ...visitorInfo,
            });

            // Update or create visitor session
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const existingSession = await db
                .select()
                .from(visitorSessions)
                .where(
                    and(
                        eq(visitorSessions.visitorId, visitorId),
                        eq(visitorSessions.userId, userId),
                        eq(visitorSessions.isActive, true),
                        gte(visitorSessions.startTime, today)
                    )
                )
                .limit(1);

            if (existingSession.length > 0) {
                // Update existing session
                await db
                    .update(visitorSessions)
                    .set({
                        endTime: new Date(),
                        pagesViewed: existingSession[0].pagesViewed + 1,
                        totalDuration: (existingSession[0].totalDuration || 0) + (sessionDuration || 0)
                    })
                    .where(eq(visitorSessions.id, existingSession[0].id));
            } else {
                // Create new session
                await db.insert(visitorSessions).values({
                    visitorId,
                    userId,
                    pagesViewed: 1,
                    totalDuration: sessionDuration || 0,
                    ipAddress: visitorInfo.ipAddress,
                });
            }
        });

        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const days = parseInt(searchParams.get('days') || '30');

        if (!userId) {
            return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const analytics = await withRetry(async () => {
            // Get views for the period
            const views = await db
                .select()
                .from(portfolioViews)
                .where(
                    and(
                        eq(portfolioViews.userId, userId),
                        gte(portfolioViews.viewedAt, startDate)
                    )
                )
                .orderBy(desc(portfolioViews.viewedAt));

            // Get sessions
            const sessions = await db
                .select()
                .from(visitorSessions)
                .where(
                    and(
                        eq(visitorSessions.userId, userId),
                        gte(visitorSessions.startTime, startDate)
                    )
                );

            // Get interactions
            const interactions = await db
                .select()
                .from(userInteractions)
                .where(
                    and(
                        eq(userInteractions.userId, userId),
                        gte(userInteractions.timestamp, startDate)
                    )
                );

            // Calculate comprehensive metrics
            const totalViews = views.length;
            const uniqueVisitors = [...new Set(views.map(v => v.visitorId))].length;
            const returningVisitors = views.length - uniqueVisitors;
            const avgSessionDuration = sessions.length > 0 
                ? Math.round(sessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) / sessions.length)
                : 0;

            // Device breakdown
            const deviceStats = views.reduce((acc, view) => {
                if (view.device) {
                    acc[view.device] = (acc[view.device] || 0) + 1;
                }
                return acc;
            }, {});

            // Browser breakdown
            const browserStats = views.reduce((acc, view) => {
                if (view.browser) {
                    acc[view.browser] = (acc[view.browser] || 0) + 1;
                }
                return acc;
            }, {});

            // OS breakdown
            const osStats = views.reduce((acc, view) => {
                if (view.os) {
                    acc[view.os] = (acc[view.os] || 0) + 1;
                }
                return acc;
            }, {});

            // Country breakdown with enhanced data
            const countryStats = views.reduce((acc, view) => {
                const country = view.country || 'Unknown';
                if (!acc[country]) {
                    acc[country] = { views: 0, sessions: 0, avgDuration: 0 };
                }
                acc[country].views += 1;
                return acc;
            }, {});

            // City breakdown
            const cityStats = views.reduce((acc, view) => {
                if (view.city) {
                    acc[view.city] = (acc[view.city] || 0) + 1;
                }
                return acc;
            }, {});

            // Referrer breakdown
            const referrerStats = views.reduce((acc, view) => {
                const referrer = view.referrer || 'Direct';
                const domain = referrer === 'Direct' ? 'Direct' : 
                    referrer.includes('google') ? 'Google' :
                    referrer.includes('facebook') ? 'Facebook' :
                    referrer.includes('linkedin') ? 'LinkedIn' :
                    referrer.includes('twitter') ? 'Twitter' :
                    new URL(referrer).hostname || 'Other';
                acc[domain] = (acc[domain] || 0) + 1;
                return acc;
            }, {});

            // Time-based analytics
            const hourlyViews = views.reduce((acc, view) => {
                const hour = new Date(view.viewedAt).getHours();
                acc[hour] = (acc[hour] || 0) + 1;
                return acc;
            }, {});

            const dailyViews = {};
            const weeklyViews = {};
            views.forEach(view => {
                const date = view.viewedAt.toISOString().split('T')[0];
                const week = getWeekNumber(new Date(view.viewedAt));
                dailyViews[date] = (dailyViews[date] || 0) + 1;
                weeklyViews[week] = (weeklyViews[week] || 0) + 1;
            });

            // Interaction analytics
            const interactionStats = interactions.reduce((acc, interaction) => {
                acc[interaction.interactionType] = (acc[interaction.interactionType] || 0) + 1;
                return acc;
            }, {});

            // Popular sections based on interactions
            const sectionEngagement = interactions.reduce((acc, interaction) => {
                if (interaction.targetElement) {
                    acc[interaction.targetElement] = (acc[interaction.targetElement] || 0) + 1;
                }
                return acc;
            }, {});

            // Engagement rate calculations
            const clickThroughRate = totalViews > 0 ? (interactions.length / totalViews) * 100 : 0;
            const bounceRate = sessions.length > 0 ? 
                (sessions.filter(s => s.pagesViewed === 1).length / sessions.length) * 100 : 0;

            // Growth calculations (compare with previous period)
            const previousPeriodStart = new Date(startDate);
            previousPeriodStart.setDate(previousPeriodStart.getDate() - days);
            
            const previousViews = await db
                .select()
                .from(portfolioViews)
                .where(
                    and(
                        eq(portfolioViews.userId, userId),
                        gte(portfolioViews.viewedAt, previousPeriodStart),
                        lt(portfolioViews.viewedAt, startDate)
                    )
                );

            const growthRate = previousViews.length > 0 ? 
                ((totalViews - previousViews.length) / previousViews.length) * 100 : 
                totalViews > 0 ? 100 : 0;

            return {
                // Core metrics
                totalViews,
                uniqueVisitors,
                returningVisitors,
                avgSessionDuration,
                bounceRate: Math.round(bounceRate),
                clickThroughRate: Math.round(clickThroughRate * 100) / 100,
                growthRate: Math.round(growthRate * 100) / 100,

                // Device & Technology
                deviceStats,
                browserStats,
                osStats,

                // Geographic
                countryStats,
                cityStats,

                // Traffic Sources
                referrerStats,

                // Time-based
                dailyViews,
                weeklyViews,
                hourlyViews,

                // Engagement
                interactionStats,
                sectionEngagement,
                totalInteractions: interactions.length,

                // Session details
                totalSessions: sessions.length,
                avgPagesPerSession: sessions.length > 0 ? 
                    Math.round(sessions.reduce((sum, s) => sum + (s.pagesViewed || 1), 0) / sessions.length * 100) / 100 : 0,

                // Recent activity
                recentViews: views.slice(0, 20).map(view => ({
                    ...view,
                    viewedAt: view.viewedAt.toISOString(),
                })),
                
                // Top performing content
                popularSections: Object.entries(sectionEngagement)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([section, count]) => ({ section, interactions: count }))
            };
        });

        // Helper function to get week number
        function getWeekNumber(date) {
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        }

        return NextResponse.json(analytics);
        
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}