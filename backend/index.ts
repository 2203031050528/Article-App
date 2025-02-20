import "./config"; // This must be the first import
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./db";
import { articles, userPreferences } from "./schema";
import { fetchAndStoreArticles } from "./fetchArticles";
import { authMiddleware } from "./middleware/auth";
import { eq } from "drizzle-orm";
import cron from "node-cron";
import { CONFIG } from "./config";

// Add type for context
type Variables = {
  userId: string;
};

const app = new Hono<{ Variables: Variables }>();

// Health check
app.get("/", (c) => c.json({ status: "ok" }));

// Protected routes
app.use("/api/*", authMiddleware);

// User Preferences Routes
app.get("/api/preferences", async (c) => {
  try {
    const userId = c.get('userId');
    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    
    return c.json({
      categories: prefs[0]?.categories || [],
      message: "Preferences retrieved successfully"
    });
  } catch (error) {
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
    const categories = body.categories.filter((cat: string) => 
      validCategories.includes(cat.toLowerCase())
    );

    if (categories.length === 0) {
      return c.json({ 
        error: "At least one valid category must be selected",
        validCategories 
      }, 400);
    }

    // Update preferences
    await db
      .insert(userPreferences)
      .values({ 
        userId, 
        categories,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { 
          categories,
          updatedAt: new Date()
        }
      });

    return c.json({ 
      message: "Preferences updated successfully",
      categories
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return c.json({ error: "Failed to update preferences" }, 500);
  }
});

// Articles Routes
app.get("/api/articles", async (c) => {
  try {
    const userId = c.get('userId');
    
    // Get user preferences
    const userPref = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    const categories = userPref[0]?.categories || ["technology"];
    
    // Get articles with pagination
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const offset = (page - 1) * limit;

    const allArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.category, categories[0])) // TODO: Add support for multiple categories
      .limit(limit)
      .offset(offset)
      .orderBy(articles.timestamp);

    return c.json({
      articles: allArticles,
      page,
      limit,
      hasMore: allArticles.length === limit
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return c.json({ error: "Failed to fetch articles" }, 500);
  }
});

// Manual fetch trigger (protected)
app.post("/api/articles/fetch", async (c) => {
  try {
    const category = c.req.query('category') || "technology";
    await fetchAndStoreArticles(category);
    return c.json({ message: "Articles fetched successfully" });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return c.json({ error: "Failed to fetch articles" }, 500);
  }
});

// Cron job
cron.schedule("0 * * * *", async () => {
  try {
    const categories = ["technology", "business", "science"];
    for (const category of categories) {
      await fetchAndStoreArticles(category);
    }
    console.log("Cron job: Articles updated successfully");
  } catch (error) {
    console.error("Cron job: Error updating articles:", error);
  }
});

// Start server
console.log(`Starting server on port ${CONFIG.PORT}...`);
serve({
  fetch: app.fetch,
  port: Number(CONFIG.PORT)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
}); 