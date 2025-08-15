'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Key,
  Shield,
  CreditCard
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  description: string;
  icon: string;
  setupUrl?: string;
  credentialsStatus: 'valid' | 'invalid' | 'missing';
}

// Mock data for payment integrations
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Stripe',
    status: 'connected',
    lastSync: '2024-12-15T10:30:00Z',
    description: 'Primary payment processor for credit cards and digital wallets',
    icon: '💳',
    setupUrl: 'https://dashboard.stripe.com',
    credentialsStatus: 'valid'
  },
  {
    id: '2',
    name: 'PayPal',
    status: 'connected',
    lastSync: '2024-12-15T09:15:00Z',
    description: 'Alternative payment method for PayPal users',
    icon: '🔵',
    setupUrl: 'https://developer.paypal.com',
    credentialsStatus: 'valid'
  },
  {
    id: '3',
    name: 'SEPA Direct Debit',
    status: 'disconnected',
    lastSync: '2024-11-20T14:30:00Z',
    description: 'European bank transfer integration',
    icon: '🏦',
    credentialsStatus: 'missing'
  },
  {
    id: '4',
    name: 'Apple Pay',
    status: 'error',
    lastSync: '2024-12-10T16:45:00Z',
    description: 'Mobile payment integration for iOS users',
    icon: '🍎',
    credentialsStatus: 'invalid'
  }
];

export function IntegrationStatus() {
  const [integrations] = useState<Integration[]>(mockIntegrations);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getCredentialsColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'missing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCredentialsLabel = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valid';
      case 'invalid':
        return 'Invalid';
      case 'missing':
        return 'Missing';
      default:
        return 'Unknown';
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalCount = integrations.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Payment Integrations</h3>
          <p className="text-sm text-gray-600">
            {connectedCount} of {totalCount} integrations active
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Manage All
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="space-y-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1">
                          {integration.status === 'connected' ? 'Connected' : 
                           integration.status === 'disconnected' ? 'Disconnected' : 'Error'}
                        </span>
                      </Badge>
                      <Badge className={getCredentialsColor(integration.credentialsStatus)}>
                        <Key className="w-3 h-3 mr-1" />
                        {getCredentialsLabel(integration.credentialsStatus)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Last sync: {formatDate(integration.lastSync)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {integration.setupUrl && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Security & Compliance</h4>
              <p className="text-sm text-blue-700 mt-1">
                All payment integrations are PCI DSS compliant and use industry-standard encryption. 
                Credentials are securely stored and never exposed in the application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {integrations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Integrations</h3>
            <p className="text-gray-600 mb-4">
              Set up payment providers to start accepting online payments from members.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Setup First Integration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 