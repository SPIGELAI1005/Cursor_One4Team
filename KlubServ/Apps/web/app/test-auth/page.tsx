"use client"

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function TestAuthPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Clerk Authentication Test
          </h1>
          
          {isSignedIn ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-green-800 font-semibold">✅ Authentication Working!</h2>
                <p className="text-green-700 text-sm mt-1">
                  You are successfully signed in with Clerk.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">User Information:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
                  <p><strong>First Name:</strong> {user?.firstName || 'Not set'}</p>
                  <p><strong>Last Name:</strong> {user?.lastName || 'Not set'}</p>
                  <p><strong>Created:</strong> {user?.createdAt?.toLocaleDateString()}</p>
                </div>
              </div>
              
              <a 
                href="/dashboard" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h2 className="text-yellow-800 font-semibold">⚠️ Not Authenticated</h2>
                <p className="text-yellow-700 text-sm mt-1">
                  You need to sign in to access the application.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Sign In
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 