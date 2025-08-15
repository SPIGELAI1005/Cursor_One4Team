'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Shield, 
  User, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'player_card' | 'medical' | 'insurance' | 'consent' | 'other';
  status: 'active' | 'valid' | 'signed' | 'expired' | 'pending';
  url: string;
  qrCode?: string;
  validUntil: string;
  createdAt: string;
  description: string;
}

interface PlayerCard {
  id: string;
  cardNumber: string;
  playerName: string;
  team: string;
  ageGroup: string;
  position: string;
  photo: string;
  qrCode: string;
  validFrom: string;
  validUntil: string;
  club: {
    name: string;
    logo: string;
    address: string;
  };
}

export function DocumentTile() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [playerCard, setPlayerCard] = useState<PlayerCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentsResponse, playerCardResponse] = await Promise.all([
          fetch('/api/player/documents'),
          fetch('/api/player/documents/card')
        ]);

        if (documentsResponse.ok) {
          const documentsData = await documentsResponse.json();
          setDocuments(documentsData.data);
        }

        if (playerCardResponse.ok) {
          const playerCardData = await playerCardResponse.json();
          setPlayerCard(playerCardData.data);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'player_card':
        return <User className="h-5 w-5" />;
      case 'medical':
        return <Shield className="h-5 w-5" />;
      case 'insurance':
        return <CreditCard className="h-5 w-5" />;
      case 'consent':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'valid':
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'valid':
      case 'signed':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isExpired = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    return today > expiryDate;
  };

  const isExpiringSoon = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const handleDownload = async (documentId: string) => {
    try {
      const response = await fetch(`/api/player/documents/${documentId}/download`);
      if (response.ok) {
        const data = await response.json();
        // In a real app, this would trigger a file download
        console.log('Download URL:', data.data.downloadUrl);
        // For demo purposes, we'll just show an alert
        alert(`Downloading ${data.data.filename}`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Card Section */}
      {playerCard && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Player Card
            </h2>
            <Badge 
              variant={isExpired(playerCard.validUntil) ? 'destructive' : 'default'}
              className="flex items-center space-x-1"
            >
              {isExpired(playerCard.validUntil) ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>Expired</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>Active</span>
                </>
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{playerCard.playerName}</h3>
                <p className="text-sm text-gray-600">Card #{playerCard.cardNumber}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Team:</span>
                  <span className="font-medium">{playerCard.team}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">{playerCard.position}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Age Group:</span>
                  <span className="font-medium">{playerCard.ageGroup}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valid From:</span>
                  <span className="font-medium">{formatDate(playerCard.validFrom)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className={`font-medium ${isExpired(playerCard.validUntil) ? 'text-red-600' : ''}`}>
                    {formatDate(playerCard.validUntil)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Card</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View QR Code</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 bg-white rounded-lg border-2 border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-xs text-gray-600">QR Code</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Scan with your phone to verify membership
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Documents Grid */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Documents & Certificates
          </h2>
          <Badge variant="outline" className="text-sm">
            {documents.length} documents
          </Badge>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p>No documents available</p>
            <p className="text-sm">Your documents will appear here once uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((document) => (
              <Card key={document.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getDocumentIcon(document.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{document.name}</h3>
                      <p className="text-xs text-gray-500">{document.description}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                    {document.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className={`font-medium ${
                      isExpired(document.validUntil) ? 'text-red-600' : 
                      isExpiringSoon(document.validUntil) ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {formatDate(document.validUntil)}
                    </span>
                  </div>
                  
                  {isExpired(document.validUntil) && (
                    <div className="flex items-center space-x-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>Document expired</span>
                    </div>
                  )}
                  
                  {isExpiringSoon(document.validUntil) && !isExpired(document.validUntil) && (
                    <div className="flex items-center space-x-1 text-xs text-yellow-600">
                      <Clock className="h-3 w-3" />
                      <span>Expires soon</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleDownload(document.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Important Notice */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Important Information</h3>
            <p className="text-xs text-yellow-700 mt-1">
              Keep your documents up to date. Expired documents may affect your participation in training and matches.
              Contact your coach or club administration if you need help renewing any documents.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 