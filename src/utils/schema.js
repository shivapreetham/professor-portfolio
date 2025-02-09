import { pgTable, serial, varchar, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    // password: varchar("password", { length: 100 }).notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    bio: text("bio"),
});

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    videoUrl: varchar("video_url", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Research Papers Table
export const researchPapers = pgTable("research_papers", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    abstract: text("abstract").notNull(),
    pdfUrl: varchar("pdf_url", { length: 255 }),
    publishedAt: timestamp("published_at").notNull(),
});

// Conferences Table
export const conferences = pgTable("conferences", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    location: varchar("location", { length: 200 }),
    date: timestamp("date").notNull(),
    paperPresented: boolean("paper_presented").default(false),
});

// Achievements Table
export const achievements = pgTable("achievements", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    date: timestamp("date").notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Teaching Experience Table
export const teachingExperience = pgTable("teaching_experience", {
    id: serial("id").primaryKey(),
    subject: varchar("subject", { length: 200 }).notNull(),
    institution: varchar("institution", { length: 200 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
});

// Awards Table
export const awards = pgTable("awards", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    organization: varchar("organization", { length: 200 }).notNull(),
    date: timestamp("date").notNull(),
});

// Collaborations Table
export const collaborations = pgTable("collaborations", {
    id: serial("id").primaryKey(),
    collaboratorName: varchar("collaborator_name", { length: 200 }).notNull(),
    institution: varchar("institution", { length: 200 }),
    projectTitle: varchar("project_title", { length: 200 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
});


  