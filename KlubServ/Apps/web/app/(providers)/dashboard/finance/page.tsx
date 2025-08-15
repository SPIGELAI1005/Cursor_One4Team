'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Settings, 
  Download,
  Plus,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Users,
  BarChart3
} from "lucide-react";
import { ContributionPlanList } from "./components/ContributionPlanList";
import { InvoiceTable } from "./components/InvoiceTable";
import { PaymentGraph } from "./components/PaymentGraph";
import { IntegrationStatus } from "./components/IntegrationStatus";
import { FinanceToolbar } from "./components/FinanceToolbar";
import { FinanceReportList } from "./components/FinanceReportList";

// Mock data for the finance dashboard
const mockStats = {
  totalRevenue: 45678.90,
  pendingInvoices: 23,
  activePlans: 8,
  monthlyGrowth: 12.5
};

const mockFiscalPeriod = {
  current: "Q4 2024",
  startDate: "2024-10-01",
  endDate: "2024-12-31"
};

export default function FinanceDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage (demo authentication)
    const userData = localStorage.getItem('one4team_user');
    
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
    } else {
      // No user found, redirect to sign-in
      router.push('/sign-in');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check if user has finance role
  if (user.role !== 'finance') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the finance dashboard.</p>
          <Button onClick={() => router.push('/sign-in')}>Sign Out</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello, {user.name || 'Finance User'} – Finance Role
                </h1>
                <p className="text-gray-600">
                  {formatDate(new Date().toISOString())} • {mockFiscalPeriod.current}
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <CheckCircle className="w-4 h-4 mr-1" />
              Finance Access Only
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockStats.totalRevenue)}</p>
                <p className="text-xs text-green-600">+{mockStats.monthlyGrowth}% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.pendingInvoices}</p>
                <p className="text-xs text-orange-600">Requires attention</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.activePlans}</p>
                <p className="text-xs text-blue-600">Contribution plans</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.monthlyGrowth}%</p>
                <p className="text-xs text-green-600">Revenue increase</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finance Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contribution Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Contribution Plans</span>
              </CardTitle>
              <CardDescription>
                Manage member contribution plans and payment schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionPlanList />
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Recent Invoices</span>
              </CardTitle>
              <CardDescription>
                Latest invoices and payment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTable />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Payment Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentGraph />
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Integration Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IntegrationStatus />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 