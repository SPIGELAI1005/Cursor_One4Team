'use client';

import { useUser } from '@clerk/nextjs';
import { Building, Award, User, Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function PressNewsHeader() {
  const { user } = useUser();

  // Mock data - in real implementation, this would come from API
  const agencyName = user?.publicMetadata?.agency_name as string || 'Your Media Outlet';
  const pressTier = user?.publicMetadata?.press_tier as string || 'Verified';
  const pressName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || 'Press Member';

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'verified':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'premium':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'standard':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Left side - Welcome and Agency Info */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={user?.imageUrl} alt={pressName} />
              <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-semibold">
                <Newspaper className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {pressName}
              </h1>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Building className="h-4 w-4" />
                <span className="font-medium">{agencyName}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-600" />
                <Badge 
                  variant="outline" 
                  className={`${getTierColor(pressTier)} font-semibold`}
                >
                  {pressTier} Press Access
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  External Contributor
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Quick Stats */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-slate-600">12</div>
              <div className="text-sm text-gray-600">Articles Viewed</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Events Tracked</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 