'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Calendar, Filter } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  summary: string;
  url: string;
  readTime: number;
}

const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Club Announces New Youth Development Program',
    category: 'General',
    publishDate: '2024-01-15',
    summary: 'The club is excited to announce the launch of a comprehensive youth development program aimed at nurturing local talent.',
    url: '/news/youth-development-program',
    readTime: 3
  },
  {
    id: '2',
    title: 'Match Report: Victory Against Local Rivals',
    category: 'Match Reports',
    publishDate: '2024-01-12',
    summary: 'A thrilling 3-2 victory in the local derby with standout performances from our midfield.',
    url: '/news/match-report-victory',
    readTime: 5
  },
  {
    id: '3',
    title: 'Annual Charity Tournament Registration Open',
    category: 'Events',
    publishDate: '2024-01-10',
    summary: 'Registration is now open for our annual charity tournament supporting local community initiatives.',
    url: '/news/charity-tournament',
    readTime: 2
  },
  {
    id: '4',
    title: 'New Training Facility Opening Ceremony',
    category: 'General',
    publishDate: '2024-01-08',
    summary: 'Join us for the grand opening of our state-of-the-art training facility this weekend.',
    url: '/news/training-facility-opening',
    readTime: 4
  },
  {
    id: '5',
    title: 'Player of the Month: January 2024',
    category: 'General',
    publishDate: '2024-01-05',
    summary: 'Congratulations to our January Player of the Month for outstanding performances.',
    url: '/news/player-month-january',
    readTime: 3
  }
];

const categories = ['All', 'General', 'Match Reports', 'Events'];

export function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>(mockNewsArticles);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In real implementation, fetch from API
    // fetchNewsArticles();
  }, []);

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Match Reports':
        return 'bg-green-100 text-green-800';
      case 'Events':
        return 'bg-purple-100 text-purple-800';
      case 'General':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Club News Center</span>
            <Badge variant="outline" className="text-sm">
              {filteredArticles.length} articles
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={getCategoryColor(article.category)}
                    >
                      {article.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {article.readTime} min read
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4 flex-shrink-0"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Article
                </Button>
              </div>
            </div>
          ))}
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No articles found for the selected category.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 