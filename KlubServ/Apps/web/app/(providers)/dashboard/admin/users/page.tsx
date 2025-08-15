'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '@/app/components/auth/RoleGuard';
import { UserRole } from '@/app/components/auth/RoleGuard';
import { Users, Shield, UserCheck, Crown, Plus, X, Settings } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  createdAt: string;
}

const ALL_ROLES: UserRole[] = ['admin', 'trainer', 'member', 'support', 'player', 'official', 'finance', 'partner', 'press-news'];

export default function AdminUsersPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole[]>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        
        // Initialize selected roles for each user
        const initialSelectedRoles: Record<string, UserRole[]> = {};
        data.users.forEach((user: User) => {
          initialSelectedRoles[user.id] = user.roles || [];
        });
        setSelectedRoles(initialSelectedRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRoles = async (userId: string, newRoles: UserRole[]) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roles: newRoles }),
      });

      if (response.ok) {
        // Update local state
        setUsers(users.map(u => 
          u.id === userId ? { ...u, roles: newRoles } : u
        ));
        setSelectedRoles(prev => ({
          ...prev,
          [userId]: newRoles
        }));
      }
    } catch (error) {
      console.error('Error updating user roles:', error);
    } finally {
      setUpdating(null);
    }
  };

  const addRoleToUser = async (userId: string, role: UserRole) => {
    const currentRoles = selectedRoles[userId] || [];
    if (!currentRoles.includes(role)) {
      const newRoles = [...currentRoles, role];
      await updateUserRoles(userId, newRoles);
    }
  };

  const removeRoleFromUser = async (userId: string, role: UserRole) => {
    const currentRoles = selectedRoles[userId] || [];
    const newRoles = currentRoles.filter(r => r !== role);
    
    // Ensure user has at least one role
    if (newRoles.length === 0) {
      newRoles.push('member');
    }
    
    await updateUserRoles(userId, newRoles);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'trainer':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'support':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'finance':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'partner':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'press-news':
        return <Users className="h-4 w-4 text-pink-600" />;
      case 'official':
        return <Users className="h-4 w-4 text-indigo-600" />;
      case 'player':
        return <Users className="h-4 w-4 text-teal-600" />;
      case 'member':
        return <Users className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'trainer':
        return 'default';
      case 'support':
        return 'secondary';
      case 'finance':
        return 'outline';
      case 'partner':
        return 'outline';
      case 'press-news':
        return 'outline';
      case 'official':
        return 'outline';
      case 'player':
        return 'outline';
      case 'member':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'trainer':
        return 'Trainer';
      case 'support':
        return 'Support';
      case 'finance':
        return 'Finance';
      case 'partner':
        return 'Partner';
      case 'press-news':
        return 'Press & News';
      case 'official':
        return 'Official';
      case 'player':
        return 'Player';
      case 'member':
        return 'Member';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>All Users ({users.length})</span>
            </CardTitle>
            <CardDescription>
              View and manage user roles. Only administrators can change roles. Users can have multiple roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-6 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Current Roles Display */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Current Roles:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoles[user.id]?.map((role) => (
                          <div key={role} className="flex items-center space-x-1">
                            <Badge variant={getRoleBadgeVariant(role)} className="flex items-center space-x-1">
                              {getRoleIcon(role)}
                              <span>{getRoleDisplayName(role)}</span>
                              <button
                                onClick={() => removeRoleFromUser(user.id, role)}
                                disabled={updating === user.id}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </div>
                        ))}
                        {(!selectedRoles[user.id] || selectedRoles[user.id].length === 0) && (
                          <span className="text-sm text-gray-500">No roles assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Add Role Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Add Role:</h4>
                      <div className="flex items-center space-x-2">
                        <Select
                          onValueChange={(value) => addRoleToUser(user.id, value as UserRole)}
                          disabled={updating === user.id}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select role to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_ROLES.filter(role => 
                              !selectedRoles[user.id]?.includes(role)
                            ).map((role) => (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center space-x-2">
                                  {getRoleIcon(role)}
                                  <span>{getRoleDisplayName(role)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {updating === user.id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                    </div>

                    {/* Bulk Role Assignment */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Bulk Role Assignment:</h4>
                      <div className="flex items-center space-x-2">
                        <Select
                          value=""
                          onValueChange={(value) => {
                            if (value) {
                              const roles = value.split(',') as UserRole[];
                              updateUserRoles(user.id, roles);
                            }
                          }}
                          disabled={updating === user.id}
                        >
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select role combination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="trainer">Trainer</SelectItem>
                            <SelectItem value="admin,trainer">Admin + Trainer</SelectItem>
                            <SelectItem value="admin,finance">Admin + Finance</SelectItem>
                            <SelectItem value="trainer,player">Trainer + Player</SelectItem>
                            <SelectItem value="member,player">Member + Player</SelectItem>
                            <SelectItem value="support,member">Support + Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
} 