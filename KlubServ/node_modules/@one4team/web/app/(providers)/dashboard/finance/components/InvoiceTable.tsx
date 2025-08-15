'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  Euro,
  User,
  FileText
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  memberName: string;
  memberId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  description: string;
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    memberName: 'Anna Müller',
    memberId: 'MEM-001',
    amount: 49.99,
    status: 'paid',
    dueDate: '2024-12-15',
    issueDate: '2024-12-01',
    description: 'Monthly membership fee - December 2024'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    memberName: 'Thomas Weber',
    memberId: 'MEM-002',
    amount: 29.99,
    status: 'pending',
    dueDate: '2024-12-20',
    issueDate: '2024-12-05',
    description: 'Youth membership fee - December 2024'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    memberName: 'Maria Schmidt',
    memberId: 'MEM-003',
    amount: 89.99,
    status: 'overdue',
    dueDate: '2024-11-30',
    issueDate: '2024-11-15',
    description: 'Family membership fee - November 2024'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    memberName: 'Hans Fischer',
    memberId: 'MEM-004',
    amount: 499.99,
    status: 'paid',
    dueDate: '2024-12-10',
    issueDate: '2024-12-01',
    description: 'Annual premium membership'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    memberName: 'Lisa Wagner',
    memberId: 'MEM-005',
    amount: 49.99,
    status: 'cancelled',
    dueDate: '2024-12-15',
    issueDate: '2024-12-01',
    description: 'Monthly membership fee - December 2024'
  }
];

export function InvoiceTable() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    // Sort by status priority: overdue > pending > paid > cancelled
    const statusPriority = { overdue: 0, pending: 1, paid: 2, cancelled: 3 };
    const statusDiff = statusPriority[a.status as keyof typeof statusPriority] - statusPriority[b.status as keyof typeof statusPriority];
    
    if (statusDiff !== 0) return statusDiff;
    
    // Then sort by due date (earliest first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Member</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-500">{invoice.description}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.memberName}</div>
                    <div className="text-sm text-gray-500">{invoice.memberId}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
                  {invoice.status === 'overdue' && (
                    <div className="text-xs text-red-600">
                      {Math.ceil((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedInvoices.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No invoices have been generated yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {sortedInvoices.length} of {invoices.length} invoices</span>
        <div className="flex items-center space-x-4">
          <span>Total: {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0))}</span>
          <span>Overdue: {invoices.filter(inv => inv.status === 'overdue').length}</span>
        </div>
      </div>
    </div>
  );
} 