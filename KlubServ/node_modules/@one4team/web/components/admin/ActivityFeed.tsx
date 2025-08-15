import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Clock } from "lucide-react";

interface ActivityItem {
  id: number;
  type: string;
  user: string;
  action: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  description?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function ActivityFeed({ 
  activities, 
  title = "Recent Activity",
  description = "Latest actions and updates in your club",
  showViewAll = true,
  onViewAll 
}: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                </div>
              </div>
            );
          })}
        </div>
        {showViewAll && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onViewAll}
            >
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 