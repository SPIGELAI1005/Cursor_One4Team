'use client';

import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { PartnerHeader } from './components/PartnerHeader';
import { SponsorStatsChart } from './components/SponsorStatsChart';
import { SponsorAssetList } from './components/SponsorAssetList';
import { PartnerContactForm } from './components/PartnerContactForm';
import { ReportDownloadCard } from './components/ReportDownloadCard';
import { Breadcrumb } from '@/app/dashboard/components/Breadcrumb';

export default function PartnerDashboardPage() {
  return (
    <SignedInWithRole requiredRoles={['partner']} redirectTo="/403">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Partner', href: '/dashboard/partner' }
          ]} 
        />

        {/* Partner Welcome Header */}
        <PartnerHeader />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Analytics and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visibility Analytics */}
            <SponsorStatsChart />
            
            {/* Sponsored Content Management */}
            <SponsorAssetList />
          </div>

          {/* Right Column - Contact and Reports */}
          <div className="space-y-6">
            {/* Contact Admin */}
            <PartnerContactForm />
            
            {/* Downloads & Reports */}
            <ReportDownloadCard />
          </div>
        </div>
      </div>
    </SignedInWithRole>
  );
} 