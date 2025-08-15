'use client';

import { useState } from 'react';
import { Upload, FileText, Image, Eye, Download, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadSponsorshipModal } from './UploadSponsorshipModal';

// Mock data - in real implementation, this would come from API
const mockAssets = [
  {
    id: '1',
    title: 'Company Logo Banner',
    type: 'image',
    status: 'active',
    location: 'Homepage Header',
    uploadDate: '2024-01-15',
    views: 1247,
    clicks: 89,
    fileSize: '2.3 MB',
    fileName: 'company-logo-banner.png'
  },
  {
    id: '2',
    title: 'Product Catalog PDF',
    type: 'pdf',
    status: 'active',
    location: 'Shop Page',
    uploadDate: '2024-01-10',
    views: 856,
    clicks: 45,
    fileSize: '5.1 MB',
    fileName: 'product-catalog-2024.pdf'
  },
  {
    id: '3',
    title: 'Promotional Video',
    type: 'video',
    status: 'expired',
    location: 'Events Page',
    uploadDate: '2023-12-01',
    views: 2341,
    clicks: 156,
    fileSize: '12.8 MB',
    fileName: 'promo-video.mp4'
  },
  {
    id: '4',
    title: 'Sponsorship Brochure',
    type: 'pdf',
    status: 'active',
    location: 'About Page',
    uploadDate: '2024-01-20',
    views: 432,
    clicks: 23,
    fileSize: '3.7 MB',
    fileName: 'sponsorship-brochure.pdf'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <Image className="h-4 w-4" />;
    case 'pdf':
      return <FileText className="h-4 w-4" />;
    case 'video':
      return <Eye className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function SponsorAssetList() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = mockAssets.filter(asset =>
    asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Sponsored Content Management</span>
            </CardTitle>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload New Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search assets by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {filteredAssets.length} assets
              </Badge>
            </div>
          </div>

          {/* Assets Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Asset</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Upload Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getFileIcon(asset.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{asset.title}</div>
                          <div className="text-sm text-gray-500">{asset.fileName}</div>
                          <div className="text-xs text-gray-400">{asset.fileSize}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(asset.status)}
                      >
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {asset.location}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{asset.views.toLocaleString()} views</div>
                        <div className="text-gray-500">{asset.clicks} clicks</div>
                        <div className="text-xs text-gray-400">
                          {((asset.clicks / asset.views) * 100).toFixed(1)}% CTR
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(asset.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No assets found. Upload your first sponsorship asset to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UploadSponsorshipModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
} 