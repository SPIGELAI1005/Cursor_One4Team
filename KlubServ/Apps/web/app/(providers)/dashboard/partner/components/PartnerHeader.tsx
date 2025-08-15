'use client';

import { useUser } from '@clerk/nextjs';
import { Building, Award, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function PartnerHeader() {
  const { user } = useUser();

  // Mock data - in real implementation, this would come from API
  const organizationName = user?.publicMetadata?.organization_name as string || 'Your Organization';
  const sponsorshipTier = user?.publicMetadata?.sponsorship_tier as string || 'Gold';
  const partnerName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || 'Partner';

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'silver':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Left side - Welcome and Organization Info */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={user?.imageUrl} alt={partnerName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {partnerName}
              </h1>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Building className="h-4 w-4" />
                <span className="font-medium">{organizationName}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-600" />
                <Badge 
                  variant="outline" 
                  className={`${getTierColor(sponsorshipTier)} font-semibold`}
                >
                  {sponsorshipTier} Sponsor
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Quick Stats */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Active Assets</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-gray-600">Monthly Views</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-purple-600">8.2%</div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 