import { auth } from '@clerk/nextjs';
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  try {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Article App
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Your personalized news aggregator
        </p>

        {userId ? (
          <Link 
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md inline-block"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">
              Please sign in to access your personalized news feed
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Auth error:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading page. Please try again.</p>
      </div>
    );
  }
}
