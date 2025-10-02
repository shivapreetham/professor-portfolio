import { db, withRetry } from '@/utils/db';
import { sectionTimeTracking } from '@/utils/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request) {
    try {
        const {
            userId,
            visitorId,
            sessionId,
            sectionName,
            timeSpent,
            scrollDepth,
            interactionCount,
            deviceType
        } = await request.json();

        if (!userId || !visitorId || !sectionName) {
            return NextResponse.json({
                error: 'userId, visitorId, and sectionName are required'
            }, { status: 400 });
        }

        await withRetry(async () => {
            await db.insert(sectionTimeTracking).values({
                userId,
                visitorId,
                sessionId,
                sectionName,
                timeSpent: timeSpent || 0,
                scrollDepth: scrollDepth || 0,
                interactionCount: interactionCount || 0,
                deviceType,
                endTime: new Date(),
            });
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error tracking section time:', error);
        return NextResponse.json({ error: 'Failed to track section time' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const days = parseInt(searchParams.get('days') || '30');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const analytics = await withRetry(async () => {
            const sectionData = await db
                .select()
                .from(sectionTimeTracking)
                .where(
                    and(
                        eq(sectionTimeTracking.userId, userId),
                        gte(sectionTimeTracking.timestamp, startDate)
                    )
                )
                .orderBy(desc(sectionTimeTracking.timestamp));

            const totalTimeBySection = sectionData.reduce((acc, item) => {
                if (!acc[item.sectionName]) {
                    acc[item.sectionName] = {
                        totalTime: 0,
                        views: 0,
                        avgTime: 0,
                        uniqueVisitors: new Set(),
                        totalScrollDepth: 0,
                        totalInteractions: 0,
                        deviceBreakdown: {},
                    };
                }
                acc[item.sectionName].totalTime += item.timeSpent || 0;
                acc[item.sectionName].views += 1;
                acc[item.sectionName].uniqueVisitors.add(item.visitorId);
                acc[item.sectionName].totalScrollDepth += item.scrollDepth || 0;
                acc[item.sectionName].totalInteractions += item.interactionCount || 0;

                if (item.deviceType) {
                    acc[item.sectionName].deviceBreakdown[item.deviceType] =
                        (acc[item.sectionName].deviceBreakdown[item.deviceType] || 0) + 1;
                }

                return acc;
            }, {});

            const sectionAnalytics = Object.entries(totalTimeBySection).map(([section, data]) => ({
                section,
                totalTime: data.totalTime,
                views: data.views,
                avgTime: Math.round(data.totalTime / data.views),
                uniqueVisitors: data.uniqueVisitors.size,
                avgScrollDepth: Math.round(data.totalScrollDepth / data.views),
                avgInteractions: Math.round((data.totalInteractions / data.views) * 100) / 100,
                deviceBreakdown: data.deviceBreakdown,
                engagementScore: calculateEngagementScore(data),
            })).sort((a, b) => b.totalTime - a.totalTime);

            const timelineData = {};
            sectionData.forEach(item => {
                const date = item.timestamp.toISOString().split('T')[0];
                if (!timelineData[date]) {
                    timelineData[date] = {};
                }
                if (!timelineData[date][item.sectionName]) {
                    timelineData[date][item.sectionName] = 0;
                }
                timelineData[date][item.sectionName] += item.timeSpent || 0;
            });

            const visitorJourney = {};
            sectionData.forEach(item => {
                if (!visitorJourney[item.visitorId]) {
                    visitorJourney[item.visitorId] = [];
                }
                visitorJourney[item.visitorId].push({
                    section: item.sectionName,
                    timeSpent: item.timeSpent,
                    timestamp: item.timestamp,
                    scrollDepth: item.scrollDepth,
                });
            });

            Object.keys(visitorJourney).forEach(visitorId => {
                visitorJourney[visitorId].sort((a, b) =>
                    new Date(a.timestamp) - new Date(b.timestamp)
                );
            });

            const topJourneys = Object.entries(visitorJourney)
                .map(([visitorId, journey]) => ({
                    visitorId,
                    path: journey.map(j => j.section),
                    totalTime: journey.reduce((sum, j) => sum + (j.timeSpent || 0), 0),
                    sections: journey.length,
                }))
                .sort((a, b) => b.totalTime - a.totalTime)
                .slice(0, 20);

            return {
                sectionAnalytics,
                timelineData,
                topJourneys,
                totalSections: Object.keys(totalTimeBySection).length,
                totalTimeTracked: sectionData.reduce((sum, item) => sum + (item.timeSpent || 0), 0),
                mostPopularSection: sectionAnalytics[0]?.section || null,
                mostEngagingSection: sectionAnalytics.sort((a, b) => b.engagementScore - a.engagementScore)[0]?.section || null,
            };
        });

        function calculateEngagementScore(data) {
            const avgTime = data.totalTime / data.views;
            const avgScrollDepth = data.totalScrollDepth / data.views;
            const avgInteractions = data.totalInteractions / data.views;

            return Math.round(
                (avgTime * 0.4) +
                (avgScrollDepth * 0.3) +
                (avgInteractions * 100 * 0.3)
            );
        }

        return NextResponse.json(analytics);

    } catch (error) {
        console.error('Error fetching section analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch section analytics' }, { status: 500 });
    }
}
