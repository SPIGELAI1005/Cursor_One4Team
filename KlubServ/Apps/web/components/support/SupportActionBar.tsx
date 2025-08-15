'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Mail, 
  User, 
  Calendar, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Settings,
  Database
} from 'lucide-react';

interface SupportActionBarProps {
  onAction?: (action: string, data?: any) => void;
}

export function SupportActionBar({ onAction }: SupportActionBarProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [actionStatus, setActionStatus] = useState<{
    type: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: '', status: 'idle', message: '' });

  const handleAction = async (action: string, data?: any) => {
    setActionStatus({ type: action, status: 'loading', message: 'Processing...' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAction?.(action, data);
      setActionStatus({ 
        type: action, 
        status: 'success', 
        message: `${action.replace('_', ' ')} completed successfully` 
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setActionStatus({ type: '', status: 'idle', message: '' });
      }, 3000);
    } catch (error) {
      setActionStatus({ 
        type: action, 
        status: 'error', 
        message: `Failed to ${action.replace('_', ' ')}` 
      });
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'reset_password':
        return <Shield className="w-4 h-4" />;
      case 'resend_welcome':
        return <Mail className="w-4 h-4" />;
      case 'view_clerk_profile':
        return <User className="w-4 h-4" />;
      case 'check_registration':
        return <Calendar className="w-4 h-4" />;
      case 'system_health':
        return <Database className="w-4 h-4" />;
      case 'faq_search':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (actionStatus.status) {
      case 'loading':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (actionStatus.status) {
      case 'loading':
        return <Badge variant="pending">Processing...</Badge>;
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          FAQ & Troubleshooting Shortcuts
        </CardTitle>
        <CardDescription>
          Quick support tools and common troubleshooting actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Display */}
        {actionStatus.status !== 'idle' && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {actionStatus.message}
            </span>
            {getStatusBadge()}
          </div>
        )}

        {/* Password Reset */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Reset Member Password
          </h3>
          <div className="flex gap-3">
            <Input
              placeholder="Enter user ID or email"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => handleAction('reset_password', { userId: selectedUserId })}
              disabled={!selectedUserId.trim() || actionStatus.status === 'loading'}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Reset Password
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            This will send a password reset email to the user's registered email address.
          </p>
        </div>

        {/* Welcome Email Resend */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Resend Welcome Email
          </h3>
          <div className="flex gap-3">
            <Input
              placeholder="Enter user email address"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => handleAction('resend_welcome', { email: selectedEmail })}
              disabled={!selectedEmail.trim() || actionStatus.status === 'loading'}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Resend Email
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Resends the welcome email with account activation instructions.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Quick Support Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleAction('view_clerk_profile')}
              disabled={actionStatus.status === 'loading'}
              className="flex items-center gap-2 h-12"
            >
              <User className="w-4 h-4" />
              View Clerk Profile
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleAction('check_registration')}
              disabled={actionStatus.status === 'loading'}
              className="flex items-center gap-2 h-12"
            >
              <Calendar className="w-4 h-4" />
              Check Registration Status
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleAction('system_health')}
              disabled={actionStatus.status === 'loading'}
              className="flex items-center gap-2 h-12"
            >
              <Database className="w-4 h-4" />
              System Health Check
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleAction('faq_search')}
              disabled={actionStatus.status === 'loading'}
              className="flex items-center gap-2 h-12"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ Search
            </Button>
          </div>
        </div>

        {/* Common Issues */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Common Issues & Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-1">Account Access Issues</h4>
              <p className="text-xs text-gray-600 mb-2">
                Users can't log in or access their account
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('troubleshoot_access')}
                disabled={actionStatus.status === 'loading'}
                className="text-xs"
              >
                Troubleshoot
              </Button>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-1">Payment Problems</h4>
              <p className="text-xs text-gray-600 mb-2">
                Payment processing or billing issues
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('troubleshoot_payment')}
                disabled={actionStatus.status === 'loading'}
                className="text-xs"
              >
                Troubleshoot
              </Button>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-1">Booking System</h4>
              <p className="text-xs text-gray-600 mb-2">
                Issues with training session bookings
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('troubleshoot_booking')}
                disabled={actionStatus.status === 'loading'}
                className="text-xs"
              >
                Troubleshoot
              </Button>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-1">Email Notifications</h4>
              <p className="text-xs text-gray-600 mb-2">
                Users not receiving emails or notifications
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('troubleshoot_email')}
                disabled={actionStatus.status === 'loading'}
                className="text-xs"
              >
                Troubleshoot
              </Button>
            </div>
          </div>
        </div>

        {/* Support Resources */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Support Resources</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('view_documentation')}
              disabled={actionStatus.status === 'loading'}
              className="text-xs"
            >
              Documentation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('view_knowledge_base')}
              disabled={actionStatus.status === 'loading'}
              className="text-xs"
            >
              Knowledge Base
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('contact_developer')}
              disabled={actionStatus.status === 'loading'}
              className="text-xs"
            >
              Contact Developer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('system_logs')}
              disabled={actionStatus.status === 'loading'}
              className="text-xs"
            >
              System Logs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 