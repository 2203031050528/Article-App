"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndStoreArticles = fetchAndStoreArticles;
const db_1 = require("./db");
const schema_1 = require("./schema");
const config_1 = require("./config");
async function fetchAndStoreArticles(category) {
    console.log(`Starting to fetch articles for category: ${category}`);
    try {
        console.log("Fetching from NewsAPI...");
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${config_1.CONFIG.NEWS_API_KEY}`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log("API response received");
        if (!data?.articles) {
            throw new Error("No articles found in API response");
        }
        const newArticles = data.articles.map((item) => ({
            title: item.title || "Untitled",
            url: item.url || "#",
            category,
            timestamp: new Date(),
        }));
        console.log(`Inserting ${newArticles.length} articles...`);
        await db_1.db.insert(schema_1.articles).values(newArticles);
        console.log("Articles inserted successfully!");
        return newArticles;
    }
    catch (error) {
        console.error("Error in fetchAndStoreArticles:", error);
        throw error;
    }
}
