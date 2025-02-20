import { db } from "./db";
import { articles } from "./schema";
import { CONFIG } from "./config";

export async function fetchAndStoreArticles(category: string) {
  console.log(`Starting to fetch articles for category: ${category}`);
  
  try {
    console.log("Fetching from NewsAPI...");
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${CONFIG.NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API response received");

    if (!data?.articles) {
      throw new Error("No articles found in API response");
    }

    const newArticles = data.articles.map((item: any) => ({
      title: item.title || "Untitled",
      url: item.url || "#",
      category,
      timestamp: new Date(),
    }));

    console.log(`Inserting ${newArticles.length} articles...`);
    await db.insert(articles).values(newArticles);
    console.log("Articles inserted successfully!");
    
    return newArticles;
  } catch (error) {
    console.error("Error in fetchAndStoreArticles:", error);
    throw error;
  }
}
