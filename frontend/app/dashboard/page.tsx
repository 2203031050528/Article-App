'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

interface Article {
  id: number;
  title: string;
  url: string;
  category: string;
  timestamp: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching articles...');
        
        const response = await apiClient.get<{ articles: Article[] }>('/api/articles');
        console.log('Articles response:', response.data);
        
        setArticles(response.data.articles);
      } catch (error: unknown) {
        console.error('Error fetching articles:', error);
        const apiError = error as ApiError;
        setError(apiError?.response?.data?.error || apiError.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoaded && user) {
      fetchArticles();
    }
  }, [isUserLoaded, user]);

  if (!isUserLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.firstName}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article: Article) => (
          <div key={article.id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 mb-4">Category: {article.category}</p>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 