import LogoFour from "@/components/LogoFour";
import One4TeamText from "@/components/One4TeamText";

export default function GuestLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <LogoFour size={40} bgColor="#1757FF" textColor="white" />
          <h1 className="text-2xl font-bold text-gray-900">
            <One4TeamText size="2xl" variant="bold" />
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <One4TeamText size="4xl" variant="bold" />
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The smart platform for sports clubs
        </p>
        <div className="space-y-4">
          <a 
            href="/sign-up" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register Club
          </a>
          <a 
            href="/sign-in" 
            className="inline-block ml-4 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Log In
          </a>
        </div>
      </main>
    </div>
  );
} 