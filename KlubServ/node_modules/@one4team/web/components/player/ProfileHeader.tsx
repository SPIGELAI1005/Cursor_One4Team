'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, User, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

interface PlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  profileImage: string;
  team: {
    id: string;
    name: string;
    ageGroup: string;
    sport: string;
    season: string;
  };
  coach: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  membership: {
    status: string;
    startDate: string;
    endDate: string;
    membershipType: string;
  };
}

export function ProfileHeader() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/player/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <User className="mx-auto h-12 w-12 mb-4" />
          <p>Unable to load profile information</p>
        </div>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarImage src={profile.profileImage} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
              {getInitials(profile.firstName, profile.lastName)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {profile.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              {getAge(profile.birthDate)} years old • {profile.team.ageGroup}
            </p>
          </div>
        </div>

        {/* Team and Coach Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{profile.team.name}</p>
              <p className="text-xs text-gray-500">{profile.team.sport} • {profile.team.season}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Coach {profile.coach.name}</p>
              <p className="text-xs text-gray-500">{profile.coach.email}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link href="/app/profile">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </Link>
          
          <Badge 
            variant={profile.membership.status === 'active' ? 'default' : 'secondary'}
            className="px-3 py-1"
          >
            {profile.membership.status === 'active' ? 'Active Member' : 'Inactive'}
          </Badge>
        </div>
      </div>
    </Card>
  );
} 