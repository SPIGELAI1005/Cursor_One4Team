'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Users, 
  Clock,
  UserCheck,
  UserX,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'trainer' | 'admin';
  team?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin?: string;
  avatar?: string;
  address?: string;
  birthDate?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  membershipDetails?: {
    type: string;
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
  };
  permissions?: string[];
}

interface UserProfileDrawerProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string, userId: string) => void;
}

export function UserProfileDrawer({ user, isOpen, onClose, onAction }: UserProfileDrawerProps) {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  if (!isOpen || !user) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" icon={<UserCheck className="w-3 h-3" />}>Active</Badge>;
      case 'inactive':
        return <Badge variant="inactive" icon={<UserX className="w-3 h-3" />}>Inactive</Badge>;
      case 'pending':
        return <Badge variant="pending" icon={<Clock className="w-3 h-3" />}>Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'trainer':
        return <Badge variant="info">Trainer</Badge>;
      case 'member':
        return <Badge variant="secondary">Member</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleAction = (action: string) => {
    onAction?.(action, user.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getRoleBadge(user.role)}
            {getStatusBadge(user.status)}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
                {user.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </p>
                  </div>
                )}
                {user.birthDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(user.birthDate)}
                    </p>
                  </div>
                )}
                {user.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {user.address}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Club Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Club Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <p className="text-sm text-gray-900">{user.team || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(user.joinDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatLastLogin(user.lastLogin)}
                  </p>
                </div>
              </div>

              {user.membershipDetails && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Membership Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                      <p className="text-sm text-gray-900">{user.membershipDetails.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <p className="text-sm text-gray-900">{formatDate(user.membershipDetails.startDate)}</p>
                    </div>
                    {user.membershipDetails.endDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <p className="text-sm text-gray-900">{formatDate(user.membershipDetails.endDate)}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auto Renew</label>
                      <Badge variant={user.membershipDetails.autoRenew ? "success" : "secondary"}>
                        {user.membershipDetails.autoRenew ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sensitive Information */}
          {user.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Emergency Contact
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                    className="ml-auto"
                  >
                    {showSensitiveInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showSensitiveInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <p className="text-sm text-gray-900">{user.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <p className="text-sm text-gray-900">{user.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <p className="text-sm text-gray-900">{user.emergencyContact.relationship}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Click the eye icon to view emergency contact information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Permissions */}
          {user.permissions && user.permissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Support Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Support Actions</CardTitle>
              <CardDescription>
                Quick actions available for support team (read-only access)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleAction('reset_password')}
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Reset Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction('resend_welcome')}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Resend Welcome Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction('view_clerk_profile')}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Clerk Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction('check_registration')}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Check Registration Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 