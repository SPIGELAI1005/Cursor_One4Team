'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  QrCode,
  CreditCard,
  File,
  Calendar,
  Shield
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'membership' | 'certificate' | 'policy' | 'receipt';
  size: string;
  date: string;
  status: 'available' | 'pending' | 'expired';
  downloadUrl?: string;
  previewUrl?: string;
}

// Mock data - in real app this would come from API
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Membership Certificate',
    type: 'certificate',
    size: '2.3 MB',
    date: '2024-01-15',
    status: 'available',
    downloadUrl: '/documents/membership-certificate.pdf',
    previewUrl: '/documents/membership-certificate-preview.pdf',
  },
  {
    id: '2',
    name: 'January 2024 Invoice',
    type: 'invoice',
    size: '1.1 MB',
    date: '2024-01-15',
    status: 'available',
    downloadUrl: '/documents/invoice-jan-2024.pdf',
    previewUrl: '/documents/invoice-jan-2024-preview.pdf',
  },
  {
    id: '3',
    name: 'Member Card',
    type: 'membership',
    size: '0.5 MB',
    date: '2024-01-10',
    status: 'available',
    downloadUrl: '/documents/member-card.pdf',
    previewUrl: '/documents/member-card-preview.pdf',
  },
  {
    id: '4',
    name: 'Club Policies',
    type: 'policy',
    size: '3.2 MB',
    date: '2024-01-01',
    status: 'available',
    downloadUrl: '/documents/club-policies.pdf',
    previewUrl: '/documents/club-policies-preview.pdf',
  },
  {
    id: '5',
    name: 'Payment Receipt - Dec 2023',
    type: 'receipt',
    size: '0.8 MB',
    date: '2023-12-15',
    status: 'available',
    downloadUrl: '/documents/receipt-dec-2023.pdf',
    previewUrl: '/documents/receipt-dec-2023-preview.pdf',
  },
  {
    id: '6',
    name: 'Training Certificate',
    type: 'certificate',
    size: '1.5 MB',
    date: '2023-11-20',
    status: 'expired',
    downloadUrl: '/documents/training-certificate.pdf',
    previewUrl: '/documents/training-certificate-preview.pdf',
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleDownload = (document: Document) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', document.name);
    alert(`Downloading ${document.name}`);
  };

  const handlePreview = (document: Document) => {
    // In a real app, this would open a preview
    console.log('Previewing:', document.name);
    alert(`Opening preview for ${document.name}`);
  };

  const handleGenerateMemberCard = () => {
    // In a real app, this would generate a new member card
    console.log('Generating member card');
    alert('Member card generation would be integrated with the backend');
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'invoice': return <CreditCard className="h-5 w-5" />;
      case 'membership': return <Shield className="h-5 w-5" />;
      case 'certificate': return <FileText className="h-5 w-5" />;
      case 'policy': return <File className="h-5 w-5" />;
      case 'receipt': return <Calendar className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'invoice': return 'bg-blue-100 text-blue-800';
      case 'membership': return 'bg-green-100 text-green-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
      case 'policy': return 'bg-orange-100 text-orange-800';
      case 'receipt': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Access and manage your club documents</p>
        </div>
        <Button onClick={handleGenerateMemberCard} className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Generate Member Card
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">Membership</h3>
          <p className="text-sm text-gray-600">2 documents</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900">Invoices</h3>
          <p className="text-sm text-gray-600">1 document</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900">Certificates</h3>
          <p className="text-sm text-gray-600">2 documents</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <File className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-medium text-gray-900">Policies</h3>
          <p className="text-sm text-gray-600">1 document</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="invoice">Invoices</option>
                <option value="membership">Membership</option>
                <option value="certificate">Certificates</option>
                <option value="policy">Policies</option>
                <option value="receipt">Receipts</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents ({filteredDocuments.length})
          </CardTitle>
          <CardDescription>
            View and download your club documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getTypeIcon(document.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{document.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{document.size}</span>
                        <span>{new Date(document.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(document.type)}>
                      {document.type}
                    </Badge>
                    <Badge className={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      {document.previewUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {document.downloadUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Document Preview</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Document preview would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 