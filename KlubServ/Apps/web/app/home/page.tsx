export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to One4Team
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The smart platform for sports clubs
        </p>
        <div className="space-x-4">
          <a
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register Club
          </a>
          <a
            href="/sign-in"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    </div>
  )
} 