import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoFour from "@/components/LogoFour";

interface DashboardHeaderProps {
  userName?: string;
  clubName?: string;
  clubLocation?: string;
  systemStatus?: 'operational' | 'warning' | 'error';
  statusMessage?: string;
}

export function DashboardHeader({ 
  userName = 'Admin',
  clubName = 'One4Team Club',
  clubLocation = 'Munich, Germany',
  systemStatus = 'operational',
  statusMessage = "All Systems Operational"
}: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statusConfig = {
    operational: {
      badgeClass: 'bg-green-100 text-green-800',
      icon: '🟢'
    },
    warning: {
      badgeClass: 'bg-yellow-100 text-yellow-800',
      icon: '🟡'
    },
    error: {
      badgeClass: 'bg-red-100 text-red-800',
      icon: '🔴'
    }
  };

  const config = statusConfig[systemStatus];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <LogoFour size={48} bgColor="#1757FF" textColor="white" className="bg-white rounded-full p-1" />
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userName}!
            </h1>
          <p className="text-blue-100 mb-1">
            {currentDate}
          </p>
          <p className="text-blue-100">
            {clubName} • {clubLocation}
          </p>
          <p className="text-blue-100 mt-2">
            You're logged in as an <span className="font-semibold">Administrator</span>
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-blue-100 text-sm">System Status</p>
            <Badge variant="secondary" className={config.badgeClass}>
              <span className="mr-1">{config.icon}</span>
              {statusMessage}
            </Badge>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-500 text-white">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
} 