'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointer, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - in real implementation, this would come from API
const mockAnalyticsData = {
  views: {
    current: 1247,
    previous: 1189,
    change: '+4.9%',
    trend: 'up'
  },
  clicks: {
    current: 89,
    previous: 76,
    change: '+17.1%',
    trend: 'up'
  },
  ctr: {
    current: 7.1,
    previous: 6.4,
    change: '+10.9%',
    trend: 'up'
  },
  impressions: {
    current: 15420,
    previous: 14230,
    change: '+8.4%',
    trend: 'up'
  }
};

const mockChartData = [
  { month: 'Jan', views: 1200, clicks: 85, impressions: 15000 },
  { month: 'Feb', views: 1350, clicks: 92, impressions: 16000 },
  { month: 'Mar', views: 1100, clicks: 78, impressions: 14000 },
  { month: 'Apr', views: 1450, clicks: 95, impressions: 17000 },
  { month: 'May', views: 1300, clicks: 88, impressions: 15500 },
  { month: 'Jun', views: 1247, clicks: 89, impressions: 15420 },
];

export function SponsorStatsChart() {
  const [selectedMetric, setSelectedMetric] = useState('views');

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: number;
    change: string;
    trend: 'up' | 'down';
    icon: any;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {value.toLocaleString()}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <Badge 
                variant={trend === 'up' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {change}
              </Badge>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SimpleChart = ({ data, metric }: { data: any[]; metric: string }) => (
    <div className="flex items-end justify-between h-32 space-x-2">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d[metric]));
        const height = (item[metric] / maxValue) * 100;
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-200 rounded-t transition-all duration-300 hover:bg-blue-300"
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Visibility Analytics</span>
          </CardTitle>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Last 30 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Views"
            value={mockAnalyticsData.views.current}
            change={mockAnalyticsData.views.change}
            trend={mockAnalyticsData.views.trend}
            icon={Eye}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Clicks"
            value={mockAnalyticsData.clicks.current}
            change={mockAnalyticsData.clicks.change}
            trend={mockAnalyticsData.clicks.trend}
            icon={MousePointer}
            color="bg-green-500"
          />
          <StatCard
            title="Click Rate"
            value={mockAnalyticsData.ctr.current}
            change={mockAnalyticsData.ctr.change}
            trend={mockAnalyticsData.ctr.trend}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <StatCard
            title="Impressions"
            value={mockAnalyticsData.impressions.current}
            change={mockAnalyticsData.impressions.change}
            trend={mockAnalyticsData.impressions.trend}
            icon={Calendar}
            color="bg-orange-500"
          />
        </div>

        {/* Chart Tabs */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="clicks">Clicks</TabsTrigger>
            <TabsTrigger value="ctr">CTR</TabsTrigger>
            <TabsTrigger value="impressions">Impressions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="views" className="mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Monthly Views Trend</h4>
              <SimpleChart data={mockChartData} metric="views" />
            </div>
          </TabsContent>
          
          <TabsContent value="clicks" className="mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Monthly Clicks Trend</h4>
              <SimpleChart data={mockChartData} metric="clicks" />
            </div>
          </TabsContent>
          
          <TabsContent value="ctr" className="mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Click-Through Rate Trend</h4>
              <div className="flex items-center justify-center h-32 text-gray-500">
                <p>CTR calculation: (clicks / views) × 100</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="impressions" className="mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Monthly Impressions Trend</h4>
              <SimpleChart data={mockChartData} metric="impressions" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 