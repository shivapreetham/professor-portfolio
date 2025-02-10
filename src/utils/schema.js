import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';
import { integer } from "drizzle-orm/sqlite-core";

// Users Table
export const user = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    bio: text("bio"),
    location: varchar("location", { length: 100 }),
    linkedIn: varchar("linkedin", { length: 255 })
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