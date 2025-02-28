'use client'

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Article App
          </Link>

          <div className="flex items-center space-x-4">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 