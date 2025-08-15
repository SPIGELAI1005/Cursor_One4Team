'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/marketing.html');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to One<span className="text-blue-600">4</span>Team
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The <span className="text-blue-600">smart</span> platform for sports clubs
        </p>
        <p className="text-sm text-gray-500">Redirecting to marketing page...</p>
      </div>
    </div>
  );
} 