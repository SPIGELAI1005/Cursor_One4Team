'use client';

import { useState } from 'react';
import { Download, FileText, BarChart3, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportType {
  id: string;
  name: string;
  description: string;
  format: 'PDF' | 'CSV' | 'Excel';
  icon: any;
  lastGenerated?: string;
  fileSize?: string;
}

const reportTypes: ReportType[] = [
  {
    id: 'performance-summary',
    name: 'Performance Summary',
    description: 'Monthly overview of all sponsorship assets performance',
    format: 'PDF',
    icon: BarChart3,
    lastGenerated: '2024-01-20',
    fileSize: '2.1 MB'
  },
  {
    id: 'engagement-analytics',
    name: 'Engagement Analytics',
    description: 'Detailed click-through rates and user interaction data',
    format: 'CSV',
    icon: TrendingUp,
    lastGenerated: '2024-01-20',
    fileSize: '1.8 MB'
  },
  {
    id: 'monthly-report',
    name: 'Monthly Report',
    description: 'Comprehensive monthly sponsorship performance report',
    format: 'PDF',
    icon: Calendar,
    lastGenerated: '2024-01-01',
    fileSize: '3.5 MB'
  },
  {
    id: 'asset-performance',
    name: 'Asset Performance',
    description: 'Individual asset performance breakdown',
    format: 'Excel',
    icon: FileText,
    lastGenerated: '2024-01-15',
    fileSize: '1.2 MB'
  }
];

export function ReportDownloadCard() {
  const [selectedReport, setSelectedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const handleDownload = async (reportId: string) => {
    setIsGenerating(true);
    setGeneratingReport(reportId);

    try {
      // Mock API call - in real implementation, this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate download
      const report = reportTypes.find(r => r.id === reportId);
      if (report) {
        // Create a mock download link
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${report.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsGenerating(false);
      setGeneratingReport(null);
    }
  };

  const handleGenerateNew = async () => {
    if (!selectedReport) return;

    setIsGenerating(true);
    setGeneratingReport(selectedReport);

    try {
      // Mock API call to generate new report
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate download after generation
      const report = reportTypes.find(r => r.id === selectedReport);
      if (report) {
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${report.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGenerating(false);
      setGeneratingReport(null);
      setSelectedReport('');
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CSV':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Excel':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-blue-600" />
          <span>Downloads & Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Report Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Generate New Report</label>
          <div className="flex space-x-2">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateNew}
              disabled={!selectedReport || isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating && generatingReport === selectedReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>

        {/* Available Reports */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Available Reports</h4>
          
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <report.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-500">{report.description}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${getFormatColor(report.format)}`}>
                      {report.format}
                    </Badge>
                    {report.lastGenerated && (
                      <span className="text-xs text-gray-400">
                        Last: {new Date(report.lastGenerated).toLocaleDateString()}
                      </span>
                    )}
                    {report.fileSize && (
                      <span className="text-xs text-gray-400">
                        {report.fileSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(report.id)}
                disabled={isGenerating}
                className="ml-4"
              >
                {isGenerating && generatingReport === report.id ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Report Information</p>
              <ul className="text-xs space-y-1">
                <li>• Reports are generated with the latest available data</li>
                <li>• PDF reports include visual charts and summaries</li>
                <li>• CSV/Excel files contain raw data for further analysis</li>
                <li>• Reports are automatically updated monthly</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 