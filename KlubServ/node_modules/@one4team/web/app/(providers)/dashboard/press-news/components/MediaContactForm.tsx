'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactForm {
  subject: string;
  message: string;
  contactType: string;
  urgency: string;
}

const contactTypes = [
  'Interview Request',
  'Press Release',
  'Photo Opportunity',
  'Event Coverage',
  'General Inquiry',
  'Other'
];

const urgencyLevels = [
  'Low - General inquiry',
  'Medium - Planning ahead',
  'High - Time sensitive',
  'Urgent - Breaking news'
];

export function MediaContactForm() {
  const [form, setForm] = useState<ContactForm>({
    subject: '',
    message: '',
    contactType: '',
    urgency: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, send to API
      // await fetch('/api/support/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...form,
      //     type: 'press-news',
      //     userId: user.id
      //   })
      // });

      setSubmitStatus('success');
      setForm({ subject: '', message: '', contactType: '', urgency: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.subject.trim() && form.message.trim() && form.contactType && form.urgency;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Contact Club Media Officer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Type */}
          <div className="space-y-2">
            <Label htmlFor="contactType">Contact Type</Label>
            <Select value={form.contactType} onValueChange={(value) => handleInputChange('contactType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact type" />
              </SelectTrigger>
              <SelectContent>
                {contactTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={form.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief subject line for your inquiry"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please provide details about your inquiry, including any specific requirements or deadlines..."
              rows={6}
              required
            />
          </div>

          {/* Response Time Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Response Time</p>
                <p className="text-blue-600">
                  We typically respond to media inquiries within 24-48 hours during business days.
                  Urgent requests are prioritized accordingly.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                Message sent successfully! We'll get back to you soon.
              </span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                Failed to send message. Please try again or contact support.
              </span>
            </div>
          )}
        </form>

        {/* Contact Information */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Media Office Contact</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>📧 media@club.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>🕒 Mon-Fri: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 