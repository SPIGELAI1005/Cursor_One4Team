'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, FileText, Image, File, Search, Calendar } from 'lucide-react';

interface PressKit {
  id: string;
  title: string;
  fileType: string;
  fileSize: string;
  lastUpdated: string;
  description: string;
  downloadUrl: string;
  category: string;
}

const mockPressKits: PressKit[] = [
  {
    id: '1',
    title: 'Club Logo Package',
    fileType: 'ZIP',
    fileSize: '2.4 MB',
    lastUpdated: '2024-01-10',
    description: 'High-resolution club logos in various formats (PNG, SVG, EPS)',
    downloadUrl: '/downloads/club-logo-package.zip',
    category: 'Branding'
  },
  {
    id: '2',
    title: 'Team Photos 2024',
    fileType: 'ZIP',
    fileSize: '15.2 MB',
    lastUpdated: '2024-01-08',
    description: 'Official team photos and individual player portraits',
    downloadUrl: '/downloads/team-photos-2024.zip',
    category: 'Media'
  },
  {
    id: '3',
    title: 'Club History PDF',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    lastUpdated: '2024-01-05',
    description: 'Comprehensive club history and achievements',
    downloadUrl: '/downloads/club-history.pdf',
    category: 'Documents'
  },
  {
    id: '4',
    title: 'Press Release Template',
    fileType: 'DOCX',
    fileSize: '45 KB',
    lastUpdated: '2024-01-03',
    description: 'Standard press release template with club branding',
    downloadUrl: '/downloads/press-release-template.docx',
    category: 'Templates'
  },
  {
    id: '5',
    title: 'Stadium Photos',
    fileType: 'ZIP',
    fileSize: '8.7 MB',
    lastUpdated: '2024-01-01',
    description: 'High-quality stadium and facility photography',
    downloadUrl: '/downloads/stadium-photos.zip',
    category: 'Media'
  },
  {
    id: '6',
    title: 'Season Statistics',
    fileType: 'XLSX',
    fileSize: '1.2 MB',
    lastUpdated: '2023-12-28',
    description: 'Current season statistics and performance data',
    downloadUrl: '/downloads/season-stats.xlsx',
    category: 'Data'
  }
];

const categories = ['All', 'Branding', 'Media', 'Documents', 'Templates', 'Data'];

export function PressKitDownloads() {
  const [pressKits, setPressKits] = useState<PressKit[]>(mockPressKits);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const filteredPressKits = pressKits.filter(kit => {
    const matchesCategory = selectedCategory === 'All' || kit.category === selectedCategory;
    const matchesSearch = kit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kit.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'zip':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Branding':
        return 'bg-blue-100 text-blue-800';
      case 'Media':
        return 'bg-purple-100 text-purple-800';
      case 'Documents':
        return 'bg-red-100 text-red-800';
      case 'Templates':
        return 'bg-green-100 text-green-800';
      case 'Data':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = async (kit: PressKit) => {
    setDownloading(kit.id);
    
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, trigger actual download
      const link = document.createElement('a');
      link.href = kit.downloadUrl;
      link.download = kit.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track download analytics
      console.log(`Downloaded: ${kit.title}`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Press Materials Download</span>
            <Badge variant="outline" className="text-sm">
              {filteredPressKits.length} files
            </Badge>
          </CardTitle>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search press materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPressKits.map((kit) => (
            <div key={kit.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getFileTypeIcon(kit.fileType)}
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(kit.category)}`}
                    >
                      {kit.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(kit.lastUpdated)}</span>
                  </div>
                  <div>{kit.fileSize}</div>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {kit.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {kit.description}
              </p>
              
              <Button
                onClick={() => handleDownload(kit)}
                disabled={downloading === kit.id}
                className="w-full"
                size="sm"
              >
                {downloading === kit.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {downloading === kit.id ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          ))}
        </div>
        
        {filteredPressKits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No press materials found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 