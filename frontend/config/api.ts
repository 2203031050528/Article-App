export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://article-app-fnx9.onrender.com';

export const API_ROUTES = {
  articles: `${API_BASE_URL}/api/articles`,
  preferences: `${API_BASE_URL}/api/preferences`,
} as const; 