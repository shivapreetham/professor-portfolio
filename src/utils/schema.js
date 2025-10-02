import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

// Users Table
export const user = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    bio: text("bio"),
    location: varchar("location", { length: 100 }),
    linkedIn: varchar("linkedin", { length: 255 }),
    theme: varchar("theme", { length: 50 }).default("light"),
    primaryColor: varchar("primary_color", { length: 50 }).default("blue"),
    customCSS: text("custom_css"),
    heroTitle: text("hero_title"),
    heroSubtitle: text("hero_subtitle"),
    sectionsOrder: text("sections_order"),
    sectionVisibility: text("section_visibility"),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});
// User Relations
export const usersRelations = relations(user, ({ many }) => ({
    projects: many(projects),
    researchPapers: many(researchPapers),
    conferences: many(conferences),
    achievements: many(achievements),
    blogPosts: many(blogPosts),
    teachingExperience: many(teachingExperience),
    awards: many(awards),
    collaborations: many(collaborations),
}));

// Projects Table
export const projects = pgTable("projects", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    collaborators: text("collaborators"),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    banner: varchar("banner", { length: 255 }),
    videoUrl: varchar("video_url", { length: 255 }),
    isPreview: boolean("is_preview").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects Relations
export const projectsRelations = relations(projects, ({ one }) => ({
    user: one(user, {
        fields: [projects.userId],
        references: [user.id],
    }),
}));

// Research Papers Table
export const researchPapers = pgTable("research_papers", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    title: varchar("title", { length: 200 }).notNull(),
    abstract: text("abstract").notNull(),
    pdfUrl: varchar("pdf_url", { length: 255 }),
    publishedAt: timestamp("published_at").notNull(),
    isPreview: boolean("is_preview").default(true).notNull(),
});

// Research Papers Relations
export const researchPapersRelations = relations(researchPapers, ({ one }) => ({
    user: one(user, {
        fields: [researchPapers.userId],
        references: [user.id],
    }),
}));

// Conferences Table
    export const conferences = pgTable("conferences", {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
        name: varchar("name", { length: 200 }).notNull(),
        location: varchar("location", { length: 200 }),
        date: timestamp("date").notNull(),
        paperPresented: boolean("paper_presented").default(false),
        isPreview: boolean("is_preview").default(true).notNull(),
    });

// Conferences Relations
export const conferencesRelations = relations(conferences, ({ one }) => ({
    user: one(user, {
        fields: [conferences.userId],
        references: [user.id],
    }),
}));

// Achievements Table
export const achievements = pgTable("achievements", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    date: timestamp("date").notNull(),
    isPreview: boolean("is_preview").default(true).notNull(),
});

// Achievements Relations
export const achievementsRelations = relations(achievements, ({ one }) => ({
    user: one(user, {
        fields: [achievements.userId],
        references: [user.id],
    }),
}));

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    isPreview: boolean("is_preview").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts Relations
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    user: one(user, {
        fields: [blogPosts.userId],
        references: [user.id],
    }),
}));

// Teaching Experience Table
export const teachingExperience = pgTable("teaching_experience", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    subject: varchar("subject", { length: 200 }).notNull(),
    institution: varchar("institution", { length: 200 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
});

// Teaching Experience Relations
export const teachingExperienceRelations = relations(teachingExperience, ({ one }) => ({
    user: one(user, {
        fields: [teachingExperience.userId],
        references: [user.id],
    }),
}));

// Awards Table
    export const awards = pgTable("awards", {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
        title: varchar("title", { length: 200 }).notNull(),
        organization: varchar("organization", { length: 200 }).notNull(),
        date: timestamp("date").notNull(),
    });

// Awards Relations
export const awardsRelations = relations(awards, ({ one }) => ({
    user: one(user, {
        fields: [awards.userId],
        references: [user.id],
    }),
}));

// Collaborations Table
export const collaborations = pgTable("collaborations", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    collaboratorName: varchar("collaborator_name", { length: 200 }).notNull(),
    institution: varchar("institution", { length: 200 }),
    projectTitle: varchar("project_title", { length: 200 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
});

// Collaborations Relations
export const collaborationsRelations = relations(collaborations, ({ one }) => ({
    user: one(user, {
        fields: [collaborations.userId],
        references: [user.id],
    }),
}));

// Portfolio Views Table - Track individual page views
export const portfolioViews = pgTable("portfolio_views", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    visitorId: text("visitor_id"), // Anonymous visitor identifier (UUID)
    ipAddress: varchar("ip_address", { length: 45 }), // Support IPv6
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),
    device: varchar("device", { length: 50 }), // mobile, desktop, tablet
    browser: varchar("browser", { length: 50 }),
    os: varchar("os", { length: 50 }),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
    sessionDuration: integer("session_duration"), // in seconds
});

// Portfolio Views Relations
export const portfolioViewsRelations = relations(portfolioViews, ({ one }) => ({
    user: one(user, {
        fields: [portfolioViews.userId],
        references: [user.id],
    }),
}));

// Visitor Sessions Table - Track visitor sessions
export const visitorSessions = pgTable("visitor_sessions", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    visitorId: text("visitor_id").notNull(), // Anonymous visitor identifier
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    startTime: timestamp("start_time").defaultNow().notNull(),
    endTime: timestamp("end_time"),
    pagesViewed: integer("pages_viewed").default(1),
    totalDuration: integer("total_duration").default(0), // in seconds
    isActive: boolean("is_active").default(true),
    ipAddress: varchar("ip_address", { length: 45 }),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),
});

// Visitor Sessions Relations
export const visitorSessionsRelations = relations(visitorSessions, ({ one }) => ({
    user: one(user, {
        fields: [visitorSessions.userId],
        references: [user.id],
    }),
}));

// User Interactions Table - Track specific interactions
export const userInteractions = pgTable("user_interactions", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    visitorId: text("visitor_id"), // Anonymous visitor identifier
    interactionType: varchar("interaction_type", { length: 50 }).notNull(), // click, download, contact, etc.
    targetElement: varchar("target_element", { length: 100 }), // project, achievement, contact_button, etc.
    targetId: text("target_id"), // ID of the specific item clicked
    metadata: text("metadata"), // JSON string with additional data
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// User Interactions Relations
export const userInteractionsRelations = relations(userInteractions, ({ one }) => ({
    user: one(user, {
        fields: [userInteractions.userId],
        references: [user.id],
    }),
}));

// Portfolio Analytics Summary Table - Aggregated stats
export const portfolioAnalytics = pgTable("portfolio_analytics", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    date: timestamp("date").notNull(), // Daily aggregation
    totalViews: integer("total_views").default(0),
    uniqueVisitors: integer("unique_visitors").default(0),
    avgSessionDuration: integer("avg_session_duration").default(0), // in seconds
    bounceRate: integer("bounce_rate").default(0), // percentage
    topCountries: text("top_countries"), // JSON array of countries
    topReferrers: text("top_referrers"), // JSON array of referrers
    deviceBreakdown: text("device_breakdown"), // JSON object with device stats
    popularSections: text("popular_sections"), // JSON array of most viewed sections
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Portfolio Analytics Relations
export const portfolioAnalyticsRelations = relations(portfolioAnalytics, ({ one }) => ({
    user: one(user, {
        fields: [portfolioAnalytics.userId],
        references: [user.id],
    }),
}));

// Section Time Tracking Table - Track time spent on each section
export const sectionTimeTracking = pgTable("section_time_tracking", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    visitorId: text("visitor_id").notNull(),
    sessionId: text("session_id"),
    sectionName: varchar("section_name", { length: 100 }).notNull(),
    timeSpent: integer("time_spent").default(0),
    startTime: timestamp("start_time").defaultNow().notNull(),
    endTime: timestamp("end_time"),
    scrollDepth: integer("scroll_depth").default(0),
    interactionCount: integer("interaction_count").default(0),
    deviceType: varchar("device_type", { length: 50 }),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const sectionTimeTrackingRelations = relations(sectionTimeTracking, ({ one }) => ({
    user: one(user, {
        fields: [sectionTimeTracking.userId],
        references: [user.id],
    }),
}));

// Update Users Relations to include analytics
export const usersRelationsUpdated = relations(user, ({ many }) => ({
    projects: many(projects),
    researchPapers: many(researchPapers),
    conferences: many(conferences),
    achievements: many(achievements),
    blogPosts: many(blogPosts),
    teachingExperience: many(teachingExperience),
    awards: many(awards),
    collaborations: many(collaborations),
    portfolioViews: many(portfolioViews),
    visitorSessions: many(visitorSessions),
    userInteractions: many(userInteractions),
    portfolioAnalytics: many(portfolioAnalytics),
    sectionTimeTracking: many(sectionTimeTracking),
}));