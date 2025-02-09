import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/utils/schema.js", // This file should now export your tables
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL, // Or your broken-out connection params
  }
});
