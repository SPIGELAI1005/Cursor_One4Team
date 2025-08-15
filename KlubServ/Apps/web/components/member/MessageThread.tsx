'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  MoreVertical,
  User,
  MessageSquare
} from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'member' | 'admin' | 'trainer';
  senderName: string;
  senderAvatar?: string;
  isRead: boolean;
}

export interface Thread {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface MessageThreadProps {
  thread: Thread;
  onSendMessage: (message: string) => void;
  onClose?: () => void;
}

export function MessageThread({ thread, onSendMessage, onClose }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{thread.title}</CardTitle>
              <p className="text-sm text-gray-600">
                {thread.participants.join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {thread.unreadCount > 0 && (
              <Badge variant="destructive">{thread.unreadCount}</Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {thread.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'member' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender !== 'member' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.senderAvatar} />
                  <AvatarFallback className="text-xs">
                    {message.senderName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'member'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {message.sender !== 'member' && (
                    <span className="text-xs font-medium text-gray-600">
                      {message.senderName}
                    </span>
                  )}
                  <span className={`text-xs ${
                    message.sender === 'member' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>

              {message.sender === 'member' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.senderAvatar} />
                  <AvatarFallback className="text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 