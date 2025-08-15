'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Mail
} from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  status: 'open' | 'closed';
  lastMessage: string;
  lastActivity: string;
  messageCount: number;
  messages: Message[];
}

interface SupportMessageViewerProps {
  onReply?: (conversationId: string, message: string) => void;
}

const TEMPLATE_REPLIES = [
  {
    id: 'welcome',
    title: 'Welcome Message',
    content: 'Welcome to our club! We\'re excited to have you as a member. If you have any questions, feel free to reach out to our support team.'
  },
  {
    id: 'password_reset',
    title: 'Password Reset',
    content: 'I\'ve initiated a password reset for your account. You should receive an email with instructions shortly. Please check your spam folder if you don\'t see it in your inbox.'
  },
  {
    id: 'account_help',
    title: 'Account Help',
    content: 'I can help you with your account. Could you please provide more details about the specific issue you\'re experiencing?'
  },
  {
    id: 'technical_issue',
    title: 'Technical Issue',
    content: 'I understand you\'re experiencing a technical issue. Our team has been notified and will investigate this matter. We\'ll get back to you as soon as possible.'
  },
  {
    id: 'general_support',
    title: 'General Support',
    content: 'Thank you for contacting support. I\'m here to help you with any questions or concerns you may have about our platform.'
  }
];

export function SupportMessageViewer({ onReply }: SupportMessageViewerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customReply, setCustomReply] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Anna Müller',
        userEmail: 'anna.mueller@example.com',
        userAvatar: '/Anna Müller.jpg',
        status: 'open',
        lastMessage: 'I can\'t seem to access my training schedule. Can you help?',
        lastActivity: '2024-01-15T10:30:00Z',
        messageCount: 3,
        messages: [
          {
            id: '1',
            userId: '1',
            userName: 'Anna Müller',
            userEmail: 'anna.mueller@example.com',
            userAvatar: '/Anna Müller.jpg',
            content: 'I can\'t seem to access my training schedule. Can you help?',
            timestamp: '2024-01-15T10:30:00Z',
            isFromUser: true
          },
          {
            id: '2',
            userId: 'support',
            userName: 'Support Team',
            userEmail: 'support@one4team.com',
            content: 'Hello Anna! I can help you with that. Could you please tell me what happens when you try to access your training schedule?',
            timestamp: '2024-01-15T10:35:00Z',
            isFromUser: false
          },
          {
            id: '3',
            userId: '1',
            userName: 'Anna Müller',
            userEmail: 'anna.mueller@example.com',
            userAvatar: '/Anna Müller.jpg',
            content: 'It shows an error message saying "Access Denied"',
            timestamp: '2024-01-15T10:40:00Z',
            isFromUser: true
          }
        ]
      },
      {
        id: '2',
        userId: '2',
        userName: 'Thomas Weber',
        userEmail: 'thomas.weber@example.com',
        status: 'closed',
        lastMessage: 'Thank you for your help!',
        lastActivity: '2024-01-14T16:20:00Z',
        messageCount: 5,
        messages: [
          {
            id: '4',
            userId: '2',
            userName: 'Thomas Weber',
            userEmail: 'thomas.weber@example.com',
            content: 'I need help resetting my password',
            timestamp: '2024-01-14T15:00:00Z',
            isFromUser: true
          },
          {
            id: '5',
            userId: 'support',
            userName: 'Support Team',
            userEmail: 'support@one4team.com',
            content: 'I\'ve initiated a password reset for your account. You should receive an email with instructions shortly.',
            timestamp: '2024-01-14T15:05:00Z',
            isFromUser: false
          },
          {
            id: '6',
            userId: '2',
            userName: 'Thomas Weber',
            userEmail: 'thomas.weber@example.com',
            content: 'Thank you for your help!',
            timestamp: '2024-01-14T16:20:00Z',
            isFromUser: true
          }
        ]
      },
      {
        id: '3',
        userId: '3',
        userName: 'Maria Schmidt',
        userEmail: 'maria.schmidt@example.com',
        status: 'open',
        lastMessage: 'How do I update my profile information?',
        lastActivity: '2024-01-15T09:15:00Z',
        messageCount: 2,
        messages: [
          {
            id: '7',
            userId: '3',
            userName: 'Maria Schmidt',
            userEmail: 'maria.schmidt@example.com',
            content: 'How do I update my profile information?',
            timestamp: '2024-01-15T09:15:00Z',
            isFromUser: true
          }
        ]
      }
    ];

    setConversations(mockConversations);
    setFilteredConversations(mockConversations);
    setLoading(false);
  }, []);

  // Filter conversations based on search term and status filter
  useEffect(() => {
    let filtered = conversations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(conversation =>
        conversation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(conversation => conversation.status === statusFilter);
    }

    setFilteredConversations(filtered);
  }, [conversations, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="pending" icon={<Clock className="w-3 h-3" />}>Open</Badge>;
      case 'closed':
        return <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATE_REPLIES.find(t => t.id === templateId);
    if (template) {
      setCustomReply(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSendReply = () => {
    if (selectedConversation && (customReply.trim() || selectedTemplate)) {
      const messageToSend = customReply.trim() || TEMPLATE_REPLIES.find(t => t.id === selectedTemplate)?.content || '';
      onReply?.(selectedConversation.id, messageToSend);
      
      // Add the reply to the conversation (in a real app, this would be handled by the API)
      const newMessage: Message = {
        id: Date.now().toString(),
        userId: 'support',
        userName: 'Support Team',
        userEmail: 'support@one4team.com',
        content: messageToSend,
        timestamp: new Date().toISOString(),
        isFromUser: false
      };

      setSelectedConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: messageToSend,
        lastActivity: new Date().toISOString()
      } : null);

      setCustomReply('');
      setSelectedTemplate('');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
          <CardDescription>Loading conversations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Message Center Viewer
        </CardTitle>
        <CardDescription>
          View and respond to user support conversations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            {/* Search and Filters */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Conversations</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Conversations */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
                      <AvatarFallback>
                        {conversation.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {conversation.userName}
                        </h4>
                        {getStatusBadge(conversation.status)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.userEmail}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(conversation.lastActivity)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {conversation.messageCount} messages
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No conversations found</p>
              </div>
            )}
          </div>

          {/* Conversation View */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="space-y-4">
                {/* Conversation Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.userAvatar} alt={selectedConversation.userName} />
                      <AvatarFallback>
                        {selectedConversation.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversation.userName}</h3>
                      <p className="text-sm text-gray-500">{selectedConversation.userEmail}</p>
                    </div>
                  </div>
                  {getStatusBadge(selectedConversation.status)}
                </div>

                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromUser ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromUser
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.isFromUser ? message.userName : 'Support Team'}
                          </span>
                          <span className="text-xs opacity-75">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Section */}
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Reply Templates
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a template...</option>
                      {TEMPLATE_REPLIES.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Reply
                    </label>
                    <textarea
                      value={customReply}
                      onChange={(e) => setCustomReply(e.target.value)}
                      placeholder="Type your reply or select a template above..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendReply}
                      disabled={!customReply.trim() && !selectedTemplate}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 