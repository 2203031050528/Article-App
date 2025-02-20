"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPreferences = exports.articles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.articles = (0, pg_core_1.pgTable)("articles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    url: (0, pg_core_1.text)("url").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull().defaultNow(),
});
exports.userPreferences = (0, pg_core_1.pgTable)("user_preferences", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull().unique(),
    categories: (0, pg_core_1.json)("categories").notNull().$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
