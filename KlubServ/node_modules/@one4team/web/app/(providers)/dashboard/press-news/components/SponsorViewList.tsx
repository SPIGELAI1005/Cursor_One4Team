'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image, Calendar, Eye } from 'lucide-react';

interface SponsoredContent {
  id: string;
  title: string;
  sponsor: string;
  imageUrl: string;
  caption: string;
  link?: string;
  status: 'published' | 'pending';
  publishDate: string;
  endDate?: string;
  views: number;
}

const mockSponsoredContent: SponsoredContent[] = [
  {
    id: '1',
    title: 'Official Club Partner - Sports Equipment',
    sponsor: 'SportTech Pro',
    imageUrl: '/sponsors/sporttech-banner.jpg',
    caption: 'Official sports equipment partner providing quality gear for all club activities',
    link: 'https://sporttechpro.com',
    status: 'published',
    publishDate: '2024-01-10',
    endDate: '2024-12-31',
    views: 1247
  },
  {
    id: '2',
    title: 'Community Health Initiative',
    sponsor: 'Local Medical Center',
    imageUrl: '/sponsors/medical-center-banner.jpg',
    caption: 'Supporting community health and wellness programs',
    status: 'published',
    publishDate: '2024-01-05',
    endDate: '2024-06-30',
    views: 892
  },
  {
    id: '3',
    title: 'Youth Development Program Sponsor',
    sponsor: 'Education Foundation',
    imageUrl: '/sponsors/education-foundation-banner.jpg',
    caption: 'Investing in the future of young athletes through education',
    link: 'https://edufoundation.org',
    status: 'pending',
    publishDate: '2024-01-15',
    views: 0
  },
  {
    id: '4',
    title: 'Training Facility Equipment',
    sponsor: 'Fitness Solutions Inc.',
    imageUrl: '/sponsors/fitness-solutions-banner.jpg',
    caption: 'State-of-the-art training equipment for optimal performance',
    status: 'published',
    publishDate: '2024-01-01',
    endDate: '2024-12-31',
    views: 654
  }
];

export function SponsorViewList() {
  const [sponsoredContent, setSponsoredContent] = useState<SponsoredContent[]>(mockSponsoredContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In real implementation, fetch sponsored content
    // fetchSponsoredContent();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewContent = (content: SponsoredContent) => {
    if (content.link) {
      window.open(content.link, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Sponsored Content</span>
          <Badge variant="outline" className="text-sm">
            {sponsoredContent.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sponsoredContent.map((content) => (
            <div key={content.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Image Placeholder */}
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {content.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Sponsored by <span className="font-medium">{content.sponsor}</span>
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(content.status)}`}
                    >
                      {content.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {content.caption}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Published: {formatDate(content.publishDate)}</span>
                      </div>
                      {content.endDate && (
                        <div className="flex items-center space-x-1">
                          <span>•</span>
                          <span>Until: {formatDate(content.endDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{content.views} views</span>
                      </div>
                    </div>
                    
                    {content.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewContent(content)}
                        className="flex-shrink-0"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {sponsoredContent.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sponsored content available at the moment.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 