import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { PressNewsHeader } from './components/PressNewsHeader';
import { NewsList } from './components/NewsList';
import { PressKitDownloads } from './components/PressKitDownloads';
import { PublicAnalyticsChart } from './components/PublicAnalyticsChart';
import { SponsorViewList } from './components/SponsorViewList';
import { MediaContactForm } from './components/MediaContactForm';
import { PublicEventsFeed } from './components/PublicEventsFeed';
import { Breadcrumb } from '@/app/dashboard/components/Breadcrumb';

export default function PressNewsDashboardPage() {
  return (
    <SignedInWithRole requiredRoles={['press-news']} redirectTo="/403">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Press & News', href: '/dashboard/press-news' }
          ]} 
        />

        {/* Press News Welcome Header */}
        <PressNewsHeader />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - News and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Club News Center */}
            <NewsList />
            
            {/* Press Materials Download */}
            <PressKitDownloads />
            
            {/* Public Analytics */}
            <PublicAnalyticsChart />
          </div>

          {/* Right Column - Contact and Events */}
          <div className="space-y-6">
            {/* Sponsored Content */}
            <SponsorViewList />
            
            {/* Contact Club Media Officer */}
            <MediaContactForm />
            
            {/* Public Events Feed */}
            <PublicEventsFeed />
          </div>
        </div>
      </div>
    </SignedInWithRole>
  );
} 