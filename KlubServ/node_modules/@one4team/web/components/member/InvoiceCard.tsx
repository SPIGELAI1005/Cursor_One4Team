import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  description: string;
  type: 'membership' | 'class' | 'equipment' | 'event' | 'other';
  receiptUrl?: string;
}

interface InvoiceCardProps {
  invoice: Invoice;
  onPay?: (invoiceId: string) => void;
  onView?: (invoiceId: string) => void;
  onDownload?: (invoiceId: string) => void;
}

const statusConfig = {
  paid: {
    label: 'Paid',
    variant: 'default' as const,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  overdue: {
    label: 'Overdue',
    variant: 'destructive' as const,
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'secondary' as const,
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};

const typeConfig = {
  membership: {
    label: 'Membership',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  class: {
    label: 'Class Fee',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  equipment: {
    label: 'Equipment',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  event: {
    label: 'Event',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  other: {
    label: 'Other',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};

export function InvoiceCard({ invoice, onPay, onView, onDownload }: InvoiceCardProps) {
  const status = statusConfig[invoice.status];
  const type = typeConfig[invoice.type];
  const StatusIcon = status.icon;

  const isOverdue = invoice.status === 'overdue';
  const isPaid = invoice.status === 'paid';
  const isCancelled = invoice.status === 'cancelled';
  const canPay = invoice.status === 'pending' || invoice.status === 'overdue';

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50' : isCancelled ? 'border-gray-200 bg-gray-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              Invoice #{invoice.invoiceNumber}
            </CardTitle>
            <CardDescription className="mt-1">
              {invoice.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={type.color.includes('blue') ? 'default' : 'secondary'} className={type.bgColor}>
              {type.label}
            </Badge>
            <Badge variant={status.variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Amount and Date */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {invoice.currency} {invoice.amount.toFixed(2)}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </div>
            {invoice.paidAt && (
              <div className="text-xs text-green-600">
                Paid: {new Date(invoice.paidAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          {canPay && onPay && (
            <Button 
              onClick={() => onPay(invoice.id)}
              className="flex-1"
              variant={isOverdue ? 'destructive' : 'default'}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isOverdue ? 'Pay Now' : 'Pay Invoice'}
            </Button>
          )}
          
          {onView && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(invoice.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
          
          {onDownload && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload(invoice.id)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                This invoice is overdue. Please pay immediately to avoid service interruption.
              </span>
            </div>
          </div>
        )}

        {/* Cancelled Notice */}
        {isCancelled && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-700">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                This invoice has been cancelled.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 