'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, Image, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface UploadSponsorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALLOWED_FILE_TYPES = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  pdf: ['.pdf'],
  video: ['.mp4', '.mov', '.avi', '.webm']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadSponsorshipModal({ isOpen, onClose }: UploadSponsorshipModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = [...ALLOWED_FILE_TYPES.image, ...ALLOWED_FILE_TYPES.pdf, ...ALLOWED_FILE_TYPES.video];
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Please select a valid file type (image, PDF, or video)');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !location) {
      setError('Please fill in all required fields and select a file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Mock upload - in real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onClose();
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileType = (fileName: string) => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    if (ALLOWED_FILE_TYPES.image.includes(extension)) return 'image';
    if (ALLOWED_FILE_TYPES.pdf.includes(extension)) return 'pdf';
    if (ALLOWED_FILE_TYPES.video.includes(extension)) return 'video';
    return 'unknown';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Upload Sponsorship Asset</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <Label htmlFor="file-upload">Asset File *</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.mp4,.mov,.avi,.webm"
                onChange={handleFileSelect}
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    {getFileType(selectedFile.name) === 'image' && <Image className="h-8 w-8 text-blue-600" />}
                    {getFileType(selectedFile.name) === 'pdf' && <FileText className="h-8 w-8 text-red-600" />}
                    {getFileType(selectedFile.name) === 'video' && <FileText className="h-8 w-8 text-purple-600" />}
                  </div>
                  <div className="font-medium text-gray-900">{selectedFile.name}</div>
                  <div className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <div className="text-lg font-medium text-gray-900">Click to upload or drag and drop</div>
                  <div className="text-sm text-gray-500">
                    Images (JPG, PNG, GIF, WebP), PDFs, or Videos (MP4, MOV, AVI, WebM) up to 10MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Asset Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Company Logo Banner"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Display Location *</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage-header">Homepage Header</SelectItem>
                  <SelectItem value="shop-page">Shop Page</SelectItem>
                  <SelectItem value="about-page">About Page</SelectItem>
                  <SelectItem value="events-page">Events Page</SelectItem>
                  <SelectItem value="news-page">News Page</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the asset and its purpose..."
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* File Type Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Supported File Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Images</div>
                <div className="text-gray-500">JPG, PNG, GIF, WebP</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Documents</div>
                <div className="text-gray-500">PDF</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Videos</div>
                <div className="text-gray-500">MP4, MOV, AVI, WebM</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Maximum file size: 10MB
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile || !title || !location}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? 'Uploading...' : 'Upload Asset'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 