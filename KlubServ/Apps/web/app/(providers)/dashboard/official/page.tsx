'use client';

import { useUser } from "@clerk/nextjs";
import { SignedInWithRole } from "@/app/components/auth/SignedInWithRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from '@/components/dashboard';
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare,
  Download,
  Mail,
  AlertCircle,
  Clock,
  Building,
  Phone,
  ExternalLink,
  Shield,
  Eye,
  Info
} from "lucide-react";

// Mock data for the official dashboard
const mockStats = {
  totalAnnouncements: 12,
  upcomingEvents: 5,
  staffMembers: 23,
  documents: 8
};

const mockAnnouncements = [
  {
    id: '1',
    title: 'Updated Hygiene Policy',
    content: 'New hygiene guidelines for all club facilities effective immediately.',
    type: 'info' as const,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Board Meeting Results',
    content: 'Summary of decisions from the latest board meeting held on January 10th.',
    type: 'info' as const,
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    title: 'Club Assembly Announcement',
    content: 'Annual club assembly scheduled for February 15th at 7:00 PM.',
    type: 'warning' as const,
    createdAt: '2024-01-10T09:15:00Z'
  }
];

const mockEvents = [
  {
    id: '1',
    title: 'Board Meeting',
    startTime: '2024-01-20T18:00:00Z',
    endTime: '2024-01-20T20:00:00Z',
    location: 'Club Office - Conference Room',
    type: 'event' as const,
    description: 'Monthly board meeting to discuss club operations and upcoming events.'
  },
  {
    id: '2',
    title: 'Community Event Planning',
    startTime: '2024-01-25T16:00:00Z',
    endTime: '2024-01-25T18:00:00Z',
    location: 'Main Hall',
    type: 'event' as const,
    description: 'Planning session for the upcoming community sports day.'
  },
  {
    id: '3',
    title: 'Annual Club Assembly',
    startTime: '2024-02-15T19:00:00Z',
    endTime: '2024-02-15T22:00:00Z',
    location: 'Sports Hall',
    type: 'event' as const,
    description: 'Annual general assembly for all club members and officials.'
  }
];

const mockStaff = [
  {
    id: '1',
    name: 'Dr. Hans Müller',
    department: 'Administration',
    role: 'Club President',
    email: 'president@club.com',
    phone: '+49 89 123 4567'
  },
  {
    id: '2',
    name: 'Maria Schmidt',
    department: 'Administration',
    role: 'Vice President',
    email: 'vice-president@club.com',
    phone: '+49 89 123 4568'
  },
  {
    id: '3',
    name: 'Thomas Weber',
    department: 'Finance',
    role: 'Treasurer',
    email: 'treasurer@club.com',
    phone: '+49 89 123 4569'
  },
  {
    id: '4',
    name: 'Anna Fischer',
    department: 'Training',
    role: 'Head Trainer',
    email: 'head-trainer@club.com',
    phone: '+49 89 123 4570'
  }
];

const mockDocuments = [
  {
    id: '1',
    name: 'Club Constitution 2024',
    type: 'PDF',
    uploadDate: '2024-01-01T00:00:00Z',
    size: '2.3 MB',
    description: 'Updated club constitution and bylaws'
  },
  {
    id: '2',
    name: 'Financial Report Q4 2023',
    type: 'PDF',
    uploadDate: '2024-01-05T00:00:00Z',
    size: '1.8 MB',
    description: 'Quarterly financial report and budget overview'
  },
  {
    id: '3',
    name: 'Strategic Plan 2024-2026',
    type: 'PDF',
    uploadDate: '2024-01-10T00:00:00Z',
    size: '3.1 MB',
    description: 'Three-year strategic development plan'
  },
  {
    id: '4',
    name: 'Safety Guidelines',
    type: 'PDF',
    uploadDate: '2024-01-12T00:00:00Z',
    size: '1.2 MB',
    description: 'Updated safety and security guidelines'
  }
];

export default function OfficialDashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  // Prepare data for unified dashboard layout
  const stats = [
    {
      title: 'Internal Announcements',
      value: mockStats.totalAnnouncements,
      subtitle: 'Active announcements',
      icon: MessageSquare,
      color: 'bg-blue-100',
      trend: {
        value: '3 new this week',
        isPositive: true
      }
    },
    {
      title: 'Upcoming Events',
      value: mockStats.upcomingEvents,
      subtitle: 'This month',
      icon: Calendar,
      color: 'bg-green-100',
      trend: {
        value: '2 board meetings',
        isPositive: true
      }
    },
    {
      title: 'Staff Members',
      value: mockStats.staffMembers,
      subtitle: 'Active staff',
      icon: Users,
      color: 'bg-purple-100',
      trend: {
        value: '4 departments',
        isPositive: true
      }
    },
    {
      title: 'Official Documents',
      value: mockStats.documents,
      subtitle: 'Available for download',
      icon: FileText,
      color: 'bg-orange-100',
      trend: {
        value: '2 updated recently',
        isPositive: true
      }
    }
  ];

  const quickActions = [
    {
      title: 'View Documents',
      description: 'Access official club documents',
      icon: FileText,
      href: '#documents',
      color: 'bg-blue-500',
    },
    {
      title: 'Contact Support',
      description: 'Get help or report issues',
      icon: MessageSquare,
      href: '#support',
      color: 'bg-green-500',
    },
    {
      title: 'Staff Directory',
      description: 'View club staff information',
      icon: Users,
      href: '#staff',
      color: 'bg-purple-500',
    },
    {
      title: 'Club Events',
      description: 'View upcoming events',
      icon: Calendar,
      href: '#events',
      color: 'bg-orange-500',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SignedInWithRole requiredRoles={['official']} redirectTo="/403">
      <DashboardLayout
        role="official"
        stats={stats}
        quickActions={quickActions}
      >
        {/* Official-specific content */}
        <div className="space-y-6">
          {/* Official Header */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Welcome, {user.firstName} – Club Official
                    </h2>
                    <p className="text-gray-600">
                      {formatDate(new Date().toISOString())} • Read-only Access
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Eye className="w-4 h-4 mr-1" />
                  Read-only Access
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Internal Club Announcements */}
              <Card id="announcements">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Internal Club Announcements
                  </CardTitle>
                  <CardDescription>
                    Latest updates and important information for club officials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDate(announcement.createdAt)}
                            </p>
                          </div>
                          <Badge className={getTypeColor(announcement.type)}>
                            {announcement.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Staff Directory */}
              <Card id="staff">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Staff Directory
                  </CardTitle>
                  <CardDescription>
                    Contact information for club staff and officials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStaff.map((staff) => (
                      <div key={staff.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{staff.name}</h3>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                          <p className="text-xs text-gray-500">{staff.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{staff.email}</p>
                          <p className="text-xs text-gray-500">{staff.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Club Events */}
              <Card id="events">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Club Events
                  </CardTitle>
                  <CardDescription>
                    Internal events, meetings, and official gatherings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(event.startTime)} at {formatTime(event.startTime)}
                              </span>
                              <span className="flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Club Documents */}
              <Card id="documents">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Club Documents
                  </CardTitle>
                  <CardDescription>
                    Official documents available for download
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{doc.name}</h3>
                            <p className="text-xs text-gray-600">{doc.description}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(doc.uploadDate)} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Support */}
              <Card id="support">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact & Support
                  </CardTitle>
                  <CardDescription>
                    Get help or report issues with your access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Club Admin Support</h3>
                        <p className="text-sm text-gray-600">admin@club.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Support Hotline</h3>
                        <p className="text-sm text-gray-600">+49 89 123 4567</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="mailto:admin@club.com?subject=Access%20Request">
                          <Mail className="w-4 h-4 mr-2" />
                          Request Access Change
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="mailto:admin@club.com?subject=Issue%20Report">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Report Issue
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SignedInWithRole>
  );
} 