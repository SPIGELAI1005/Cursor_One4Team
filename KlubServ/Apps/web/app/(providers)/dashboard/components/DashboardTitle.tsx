'use client';

import Link from 'next/link';
import One4TeamText from '@/components/One4TeamText';

export function DashboardTitle() {
  return (
    <div className="flex-shrink-0">
      <h1 className="text-xl font-bold">
        <One4TeamText size="xl" variant="bold" className="text-blue-600" />
        <span className="text-gray-900"> Dashboard</span>
      </h1>
    </div>
  );
} 