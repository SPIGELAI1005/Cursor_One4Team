'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageThread, Thread, Message } from '@/components/member/MessageThread';
import { 
  MessageSquare, 
  Search, 
  Plus,
  User,
  Shield,
  Users
} from 'lucide-react';

// Mock data - in real app this would come from API
const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'General Support',
    participants: ['Support Team', 'You'],
    lastMessage: 'Thank you for your inquiry. We\'ll get back to you soon.',
    lastMessageTime: '2024-01-15T10:30:00Z',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        content: 'Hi, I have a question about my membership.',
        timestamp: '2024-01-15T10:00:00Z',
        sender: 'member',
        senderName: 'You',
        isRead: true,
      },
      {
        id: '2',
        content: 'Hello! How can I help you today?',
        timestamp: '2024-01-15T10:05:00Z',
        sender: 'admin',
        senderName: 'Support Team',
        isRead: true,
      },
      {
        id: '3',
        content: 'I\'d like to know about upgrading my membership.',
        timestamp: '2024-01-15T10:10:00Z',
        sender: 'member',
        senderName: 'You',
        isRead: true,
      },
      {
        id: '4',
        content: 'Thank you for your inquiry. We\'ll get back to you soon.',
        timestamp: '2024-01-15T10:30:00Z',
        sender: 'admin',
        senderName: 'Support Team',
        isRead: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Training Schedule',
    participants: ['Coach Mike', 'You'],
    lastMessage: 'The new schedule will be posted tomorrow.',
    lastMessageTime: '2024-01-14T16:45:00Z',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        content: 'When will the new training schedule be available?',
        timestamp: '2024-01-14T16:00:00Z',
        sender: 'member',
        senderName: 'You',
        isRead: true,
      },
      {
        id: '2',
        content: 'The new schedule will be posted tomorrow.',
        timestamp: '2024-01-14T16:45:00Z',
        sender: 'trainer',
        senderName: 'Coach Mike',
        isRead: true,
      },
    ],
  },
  {
    id: '3',
    title: 'Payment Inquiry',
    participants: ['Billing Team', 'You'],
    lastMessage: 'Your payment has been processed successfully.',
    lastMessageTime: '2024-01-13T14:20:00Z',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        content: 'I have a question about my recent payment.',
        timestamp: '2024-01-13T14:00:00Z',
        sender: 'member',
        senderName: 'You',
        isRead: true,
      },
      {
        id: '2',
        content: 'Your payment has been processed successfully.',
        timestamp: '2024-01-13T14:20:00Z',
        sender: 'admin',
        senderName: 'Billing Team',
        isRead: true,
      },
    ],
  },
];

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.participants.some(participant => 
      participant.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSendMessage = (message: string) => {
    if (!selectedThread) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toISOString(),
      sender: 'member',
      senderName: 'You',
      isRead: false,
    };

    const updatedThread = {
      ...selectedThread,
      messages: [...selectedThread.messages, newMessage],
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    };

    setThreads(prev => 
      prev.map(thread => 
        thread.id === selectedThread.id ? updatedThread : thread
      )
    );
    setSelectedThread(updatedThread);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with club staff and trainers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Threads List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedThread?.id === thread.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <MessageSquare className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {thread.title}
                        </h4>
                        {thread.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {thread.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(thread.lastMessageTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedThread ? (
            <MessageThread
              thread={selectedThread}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common support topics and quick access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Membership</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Training</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">General</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <User className="h-6 w-6" />
              <span className="text-sm">Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 