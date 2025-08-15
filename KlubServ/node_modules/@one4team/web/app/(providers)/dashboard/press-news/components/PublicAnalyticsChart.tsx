'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Eye, Share2, BarChart3, Calendar } from 'lucide-react';

interface AnalyticsData {
  pageVisits: number;
  socialEngagement: number;
  topArticles: Array<{
    title: string;
    views: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    visits: number;
    engagement: number;
  }>;
}

const mockAnalyticsData: AnalyticsData = {
  pageVisits: 12450,
  socialEngagement: 2340,
  topArticles: [
    { title: 'Club Announces New Youth Development Program', views: 1247 },
    { title: 'Match Report: Victory Against Local Rivals', views: 892 },
    { title: 'Annual Charity Tournament Registration Open', views: 654 },
    { title: 'New Training Facility Opening Ceremony', views: 543 },
    { title: 'Player of the Month: January 2024', views: 432 }
  ],
  monthlyTrends: [
    { month: 'Jan', visits: 1200, engagement: 180 },
    { month: 'Feb', visits: 1350, engagement: 220 },
    { month: 'Mar', visits: 1100, engagement: 160 },
    { month: 'Apr', visits: 1450, engagement: 240 },
    { month: 'May', visits: 1600, engagement: 280 },
    { month: 'Jun', visits: 1750, engagement: 320 }
  ]
};

const timeRanges = ['7 days', '30 days', '90 days', '1 year'];

export function PublicAnalyticsChart() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30 days');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In real implementation, fetch analytics data based on time range
    // fetchAnalyticsData(selectedTimeRange);
  }, [selectedTimeRange]);

  const getTrendIcon = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    }
    return <BarChart3 className="h-4 w-4 text-gray-500" />;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const maxVisits = Math.max(...data.monthlyTrends.map(t => t.visits));
  const maxEngagement = Math.max(...data.monthlyTrends.map(t => t.engagement));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Visibility Statistics</span>
            <Badge variant="outline" className="text-sm">
              Public Data
            </Badge>
          </CardTitle>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Page Visits</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatNumber(data.pageVisits)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      +12.5% from last period
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Social Engagement</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatNumber(data.socialEngagement)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +8.3% from last period
                    </p>
                  </div>
                  <Share2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
            <div className="space-y-3">
              {data.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {trend.month}
                  </div>
                  
                  {/* Visits Bar */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(trend.visits / maxVisits) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {formatNumber(trend.visits)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Engagement Bar */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(trend.engagement / maxEngagement) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {formatNumber(trend.engagement)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-2 bg-blue-500 rounded"></div>
                <span>Page Visits</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-2 bg-green-500 rounded"></div>
                <span>Engagement</span>
              </div>
            </div>
          </div>

          {/* Top Articles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top-Read Articles</h3>
            <div className="space-y-3">
              {data.topArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {formatNumber(article.views)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 