'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Mail,
  Eye,
  MessageSquare
} from 'lucide-react';

interface FlaggedIssue {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  issue: string;
  description: string;
  category: 'technical' | 'account' | 'payment' | 'booking' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  timestamp: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
}

interface FlaggedIssuesTableProps {
  onIssueSelect?: (issue: FlaggedIssue) => void;
  onStatusUpdate?: (issueId: string, status: string) => void;
}

export function FlaggedIssuesTable({ onIssueSelect, onStatusUpdate }: FlaggedIssuesTableProps) {
  const [issues, setIssues] = useState<FlaggedIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<FlaggedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockIssues: FlaggedIssue[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Anna Müller',
        userEmail: 'anna.mueller@example.com',
        userAvatar: '/Anna Müller.jpg',
        issue: 'Cannot access training schedule',
        description: 'When I try to view my training schedule, I get an "Access Denied" error message. This started happening yesterday.',
        category: 'technical',
        priority: 'high',
        status: 'new',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Thomas Weber',
        userEmail: 'thomas.weber@example.com',
        issue: 'Payment not processed',
        description: 'I made a payment for my membership renewal but it shows as pending. The money was deducted from my account.',
        category: 'payment',
        priority: 'critical',
        status: 'in_progress',
        timestamp: '2024-01-14T15:20:00Z',
        assignedTo: 'Support Team'
      },
      {
        id: '3',
        userId: '3',
        userName: 'Maria Schmidt',
        userEmail: 'maria.schmidt@example.com',
        issue: 'Booking system error',
        description: 'I\'m trying to book a training session but the system keeps showing "No available slots" even though I can see open times.',
        category: 'booking',
        priority: 'medium',
        status: 'resolved',
        timestamp: '2024-01-13T09:15:00Z',
        assignedTo: 'Support Team',
        resolution: 'Fixed booking system cache issue. User can now book sessions.',
        resolvedAt: '2024-01-14T11:30:00Z'
      },
      {
        id: '4',
        userId: '4',
        userName: 'Hans Bauer',
        userEmail: 'hans.bauer@example.com',
        issue: 'Account activation pending',
        description: 'I registered for membership 3 days ago but my account is still showing as pending activation.',
        category: 'account',
        priority: 'high',
        status: 'new',
        timestamp: '2024-01-12T16:45:00Z'
      },
      {
        id: '5',
        userId: '5',
        userName: 'Lisa Wagner',
        userEmail: 'lisa.wagner@example.com',
        issue: 'General inquiry about membership',
        description: 'I have questions about upgrading my membership plan and what benefits are included.',
        category: 'general',
        priority: 'low',
        status: 'closed',
        timestamp: '2024-01-11T14:20:00Z',
        assignedTo: 'Support Team',
        resolution: 'Provided detailed information about membership plans and benefits.',
        resolvedAt: '2024-01-12T10:15:00Z'
      }
    ];

    setIssues(mockIssues);
    setFilteredIssues(mockIssues);
    setLoading(false);
  }, []);

  // Filter issues based on search term and filters
  useEffect(() => {
    let filtered = issues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="pending" icon={<Clock className="w-3 h-3" />}>New</Badge>;
      case 'in_progress':
        return <Badge variant="info" icon={<AlertTriangle className="w-3 h-3" />}>In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>Resolved</Badge>;
      case 'closed':
        return <Badge variant="inactive" icon={<XCircle className="w-3 h-3" />}>Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'technical':
        return <Badge variant="destructive">Technical</Badge>;
      case 'account':
        return <Badge variant="info">Account</Badge>;
      case 'payment':
        return <Badge variant="warning">Payment</Badge>;
      case 'booking':
        return <Badge variant="success">Booking</Badge>;
      case 'general':
        return <Badge variant="secondary">General</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    onStatusUpdate?.(issueId, newStatus);
    
    // Update local state (in a real app, this would be handled by the API)
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus as any, resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined }
        : issue
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flags & Issues Feed</CardTitle>
          <CardDescription>Loading issues...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Flags & Issues Feed
        </CardTitle>
        <CardDescription>
          Monitor and manage user-submitted issues and flagged errors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="payment">Payment</option>
              <option value="booking">Booking</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredIssues.length} of {issues.length} issues
        </div>

        {/* Issues Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Issue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={issue.userAvatar} alt={issue.userName} />
                        <AvatarFallback>
                          {issue.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{issue.userName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {issue.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{issue.issue}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {issue.description}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getCategoryBadge(issue.category)}
                  </td>
                  <td className="py-3 px-4">
                    {getPriorityBadge(issue.priority)}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(issue.status)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatTimestamp(issue.timestamp)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onIssueSelect?.(issue)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      {issue.status === 'new' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(issue.id, 'in_progress')}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                      {issue.status === 'in_progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(issue.id, 'resolved')}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No issues found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 