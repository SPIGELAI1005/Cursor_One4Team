'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Clock
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  lastGenerated?: string;
  size: string;
  icon: React.ReactNode;
}

// Mock data for financial reports
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Financial Report',
    description: 'Comprehensive monthly overview including revenue, expenses, and member statistics',
    type: 'monthly',
    format: 'pdf',
    lastGenerated: '2024-12-01T00:00:00Z',
    size: '2.4 MB',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: '2',
    title: 'Revenue Analysis',
    description: 'Detailed breakdown of revenue sources, payment methods, and trends',
    type: 'monthly',
    format: 'excel',
    lastGenerated: '2024-12-15T10:30:00Z',
    size: '1.8 MB',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: '3',
    title: 'Member Payment Status',
    description: 'Current payment status for all members with overdue and pending invoices',
    type: 'monthly',
    format: 'csv',
    lastGenerated: '2024-12-15T09:15:00Z',
    size: '856 KB',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '4',
    title: 'Quarterly Financial Summary',
    description: 'Quarterly financial performance with year-over-year comparisons',
    type: 'quarterly',
    format: 'pdf',
    lastGenerated: '2024-10-01T00:00:00Z',
    size: '3.2 MB',
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: '5',
    title: 'Annual Financial Report',
    description: 'Complete annual financial report for tax and compliance purposes',
    type: 'annual',
    format: 'pdf',
    lastGenerated: '2024-01-01T00:00:00Z',
    size: '5.1 MB',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    id: '6',
    title: 'Payment Method Analysis',
    description: 'Analysis of payment method usage and success rates',
    type: 'monthly',
    format: 'excel',
    lastGenerated: '2024-12-14T16:45:00Z',
    size: '1.2 MB',
    icon: <TrendingUp className="w-5 h-5" />
  }
];

export function FinanceReportList() {
  const [reports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quarterly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'annual':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'custom':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return '📄';
      case 'csv':
        return '📊';
      case 'excel':
        return '📈';
      default:
        return '📄';
    }
  };

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedType);

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Financial Reports</h3>
          <p className="text-sm text-gray-600">
            Generate and download financial reports for analysis and compliance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Reports</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
            <option value="custom">Custom</option>
          </select>
          
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">
                    {report.icon}
                  </div>
                  <Badge className={getTypeColor(report.type)}>
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </Badge>
                </div>
                <div className="text-2xl">{getFormatIcon(report.format)}</div>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2">{report.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Size: {report.size}</span>
                {report.lastGenerated && (
                  <span>Updated: {formatDate(report.lastGenerated)}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Clock className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
            <p className="text-gray-600 mb-4">
              {selectedType !== 'all' 
                ? `No ${selectedType} reports found. Try generating a new report.`
                : 'No financial reports have been generated yet.'
              }
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate First Report
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Generation Options */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Need a Custom Report?</h4>
              <p className="text-sm text-gray-600">
                Generate reports for specific date ranges, member groups, or financial metrics
              </p>
            </div>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Create Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 