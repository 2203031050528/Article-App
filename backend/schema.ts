import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  preferred_categories: text("preferred_categories").array().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});
