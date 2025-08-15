'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Calendar,
  Search,
  Filter,
  Star
} from 'lucide-react';

interface BookingItem {
  id: string;
  name: string;
  description: string;
  type: 'facility' | 'equipment' | 'service' | 'camp';
  location: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  capacity: number;
  available: number;
  rating: number;
  image: string;
  availableSlots: {
    date: string;
    time: string;
    available: boolean;
  }[];
}

// Mock data - in real app this would come from API
const mockBookingItems: BookingItem[] = [
  {
    id: '1',
    name: 'Tennis Court',
    description: 'Professional tennis court with lighting for evening games',
    type: 'facility',
    location: 'Outdoor Courts',
    price: 25,
    currency: 'USD',
    duration: 60,
    capacity: 4,
    available: 2,
    rating: 4.8,
    image: '/tennis-court.jpg',
    availableSlots: [
      { date: '2024-01-16', time: '09:00', available: true },
      { date: '2024-01-16', time: '10:00', available: true },
      { date: '2024-01-16', time: '11:00', available: false },
      { date: '2024-01-16', time: '14:00', available: true },
    ],
  },
  {
    id: '2',
    name: 'Basketball Equipment',
    description: 'Complete basketball set including balls, nets, and training equipment',
    type: 'equipment',
    location: 'Equipment Room',
    price: 15,
    currency: 'USD',
    duration: 120,
    capacity: 10,
    available: 5,
    rating: 4.5,
    image: '/basketball-equipment.jpg',
    availableSlots: [
      { date: '2024-01-16', time: '08:00', available: true },
      { date: '2024-01-16', time: '10:00', available: true },
      { date: '2024-01-16', time: '12:00', available: true },
    ],
  },
  {
    id: '3',
    name: 'Personal Training Session',
    description: 'One-on-one training session with certified personal trainer',
    type: 'service',
    location: 'Training Area',
    price: 50,
    currency: 'USD',
    duration: 60,
    capacity: 1,
    available: 1,
    rating: 4.9,
    image: '/personal-training.jpg',
    availableSlots: [
      { date: '2024-01-16', time: '07:00', available: true },
      { date: '2024-01-16', time: '08:00', available: false },
      { date: '2024-01-16', time: '17:00', available: true },
    ],
  },
  {
    id: '4',
    name: 'Summer Sports Camp',
    description: 'Week-long sports camp for kids aged 8-14',
    type: 'camp',
    location: 'Main Facility',
    price: 200,
    currency: 'USD',
    duration: 480, // 8 hours
    capacity: 30,
    available: 12,
    rating: 4.7,
    image: '/summer-camp.jpg',
    availableSlots: [
      { date: '2024-07-15', time: '09:00', available: true },
      { date: '2024-07-22', time: '09:00', available: true },
      { date: '2024-07-29', time: '09:00', available: true },
    ],
  },
];

export default function BookingsPage() {
  const [bookingItems, setBookingItems] = useState<BookingItem[]>(mockBookingItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BookingItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const filteredItems = bookingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleBook = (itemId: string, slot: { date: string; time: string }) => {
    // In a real app, this would create a booking
    console.log('Booking:', itemId, slot);
    alert('Booking functionality would be integrated with the backend');
  };

  const getTypeColor = (type: BookingItem['type']) => {
    switch (type) {
      case 'facility': return 'bg-blue-100 text-blue-800';
      case 'equipment': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      case 'camp': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Reserve facilities, equipment, and services</p>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="facility">Facilities</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="camp">Camps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select defaultValue="name">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute top-2 left-2">
                <Badge className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white px-2 py-1 rounded">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium">{item.rating}</span>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {formatDuration(item.duration)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {item.available}/{item.capacity} available
                  </span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-lg">
                  <DollarSign className="h-4 w-4" />
                  {item.price}
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => setSelectedItem(item)}
                disabled={item.available === 0}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {item.available === 0 ? 'Fully Booked' : 'Book Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Book {selectedItem.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(null);
                    setSelectedSlot(null);
                  }}
                >
                  ×
                </Button>
              </div>
              <CardDescription>{selectedItem.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Item Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Location:</span> {selectedItem.location}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {formatDuration(selectedItem.duration)}
                </div>
                <div>
                  <span className="font-medium">Price:</span> ${selectedItem.price}
                </div>
                <div>
                  <span className="font-medium">Available:</span> {selectedItem.available}/{selectedItem.capacity}
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <h4 className="font-medium mb-3">Available Time Slots</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedItem.availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? 'default' : 'outline'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot({ date: slot.date, time: slot.time })}
                      className="justify-start"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(slot.date).toLocaleDateString()} {slot.time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Booking Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedItem(null);
                    setSelectedSlot(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!selectedSlot}
                  onClick={() => {
                    if (selectedSlot) {
                      handleBook(selectedItem.id, selectedSlot);
                    }
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 