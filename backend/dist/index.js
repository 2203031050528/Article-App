"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config"); // This must be the first import
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const db_1 = require("./db");
const schema_1 = require("./schema");
const fetchArticles_1 = require("./fetchArticles");
const auth_1 = require("./middleware/auth");
const drizzle_orm_1 = require("drizzle-orm");
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("./config");
const app = new hono_1.Hono();
// Health check
app.get("/", (c) => c.json({ status: "ok" }));
// Protected routes
app.use("/api/*", auth_1.authMiddleware);
// User Preferences Routes
app.get("/api/preferences", async (c) => {
    try {
        const userId = c.get('userId');
        const prefs = await db_1.db
            .select()
            .from(schema_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(schema_1.userPreferences.userId, userId));
        return c.json({
            categories: prefs[0]?.categories || [],
            message: "Preferences retrieved successfully"
        });
    }
    catch (error) {
        console.error("Error fetching preferences:", error);
        return c.json({ error: "Failed to fetch preferences" }, 500);
    }
});
app.post("/api/preferences", async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        // Validate categories
        if (!body.categories || !Array.isArray(body.categories)) {
            return c.json({ error: "Categories must be an array" }, 400);
        }
        // Validate each category
        const validCategories = ["technology", "business", "science", "health", "sports"];
        const categories = body.categories.filter((cat) => validCategories.includes(cat.toLowerCase()));
        if (categories.length === 0) {
            return c.json({
                error: "At least one valid category must be selected",
                validCategories
            }, 400);
        }
        // Update preferences
        await db_1.db
            .insert(schema_1.userPreferences)
            .values({
            userId,
            categories,
            updatedAt: new Date()
        })
            .onConflictDoUpdate({
            target: schema_1.userPreferences.userId,
            set: {
                categories,
                updatedAt: new Date()
            }
        });
        return c.json({
            message: "Preferences updated successfully",
            categories
        });
    }
    catch (error) {
        console.error("Error updating preferences:", error);
        return c.json({ error: "Failed to update preferences" }, 500);
    }
});
// Articles Routes
app.get("/api/articles", async (c) => {
    try {
        const userId = c.get('userId');
        // Get user preferences
        const userPref = await db_1.db
            .select()
            .from(schema_1.userPreferences)
            .where((0, drizzle_orm_1.eq)(schema_1.userPreferences.userId, userId));
        const categories = userPref[0]?.categories || ["technology"];
        // Get articles with pagination
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 10;
        const offset = (page - 1) * limit;
        const allArticles = await db_1.db
            .select()
            .from(schema_1.articles)
            .where((0, drizzle_orm_1.eq)(schema_1.articles.category, categories[0])) // TODO: Add support for multiple categories
            .limit(limit)
            .offset(offset)
            .orderBy(schema_1.articles.timestamp);
        return c.json({
            articles: allArticles,
            page,
            limit,
            hasMore: allArticles.length === limit
        });
    }
    catch (error) {
        console.error("Error fetching articles:", error);
        return c.json({ error: "Failed to fetch articles" }, 500);
    }
});
// Manual fetch trigger (protected)
app.post("/api/articles/fetch", async (c) => {
    try {
        const category = c.req.query('category') || "technology";
        await (0, fetchArticles_1.fetchAndStoreArticles)(category);
        return c.json({ message: "Articles fetched successfully" });
    }
    catch (error) {
        console.error("Error fetching articles:", error);
        return c.json({ error: "Failed to fetch articles" }, 500);
    }
});
// Cron job
node_cron_1.default.schedule("0 * * * *", async () => {
    try {
        const categories = ["technology", "business", "science"];
        for (const category of categories) {
            await (0, fetchArticles_1.fetchAndStoreArticles)(category);
        }
        console.log("Cron job: Articles updated successfully");
    }
    catch (error) {
        console.error("Cron job: Error updating articles:", error);
    }
});
// Start server
console.log(`Starting server on port ${config_1.CONFIG.PORT}...`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: Number(config_1.CONFIG.PORT)
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
