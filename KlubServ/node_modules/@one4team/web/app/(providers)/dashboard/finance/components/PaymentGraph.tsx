'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  CreditCard, 
  Calendar,
  Euro,
  User,
  CheckCircle,
  Clock,
  BarChart3,
  XCircle
} from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface Payment {
  id: string;
  date: string;
  payerName: string;
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

// Mock data for recent payments
const mockPayments: Payment[] = [
  {
    id: '1',
    date: '2024-12-15T10:30:00Z',
    payerName: 'Anna Müller',
    method: 'stripe',
    amount: 49.99,
    status: 'completed',
    description: 'Monthly membership fee'
  },
  {
    id: '2',
    date: '2024-12-15T09:15:00Z',
    payerName: 'Thomas Weber',
    method: 'paypal',
    amount: 29.99,
    status: 'completed',
    description: 'Youth membership fee'
  },
  {
    id: '3',
    date: '2024-12-14T16:45:00Z',
    payerName: 'Maria Schmidt',
    method: 'bank_transfer',
    amount: 89.99,
    status: 'pending',
    description: 'Family membership fee'
  },
  {
    id: '4',
    date: '2024-12-14T14:20:00Z',
    payerName: 'Hans Fischer',
    method: 'stripe',
    amount: 499.99,
    status: 'completed',
    description: 'Annual premium membership'
  },
  {
    id: '5',
    date: '2024-12-14T11:30:00Z',
    payerName: 'Lisa Wagner',
    method: 'cash',
    amount: 49.99,
    status: 'completed',
    description: 'Monthly membership fee'
  },
  {
    id: '6',
    date: '2024-12-13T15:10:00Z',
    payerName: 'Peter Schulz',
    method: 'stripe',
    amount: 49.99,
    status: 'failed',
    description: 'Monthly membership fee'
  }
];

// Mock revenue data for the last 6 months
const mockRevenueData = [
  { month: 'Jul', revenue: 42000 },
  { month: 'Aug', revenue: 43500 },
  { month: 'Sep', revenue: 41000 },
  { month: 'Oct', revenue: 44500 },
  { month: 'Nov', revenue: 43200 },
  { month: 'Dec', revenue: 45678 }
];

export function PaymentGraph() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [revenueData] = useState(mockRevenueData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Stripe';
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return '💳';
      case 'paypal':
        return '🔵';
      case 'bank_transfer':
        return '🏦';
      case 'cash':
        return '💵';
      default:
        return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const recentPayments = payments.slice(0, 5);
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-lg font-semibold">{payments.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-lg font-semibold">
                  {Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Revenue Trend (Last 6 Months)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(data.revenue / maxRevenue) * 200}px`,
                    minHeight: '20px'
                  }}
                ></div>
                <span className="text-xs text-gray-600">{data.month}</span>
                <span className="text-xs font-medium">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getMethodIcon(payment.method)}</div>
                  <div>
                    <div className="font-medium text-gray-900">{payment.payerName}</div>
                    <div className="text-sm text-gray-600">{payment.description}</div>
                    <div className="text-xs text-gray-500">{formatDate(payment.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                    <div className="text-sm text-gray-600">{getMethodLabel(payment.method)}</div>
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusIcon(payment.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {recentPayments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Transactions</h3>
              <p className="text-gray-600">No payment transactions have been recorded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 