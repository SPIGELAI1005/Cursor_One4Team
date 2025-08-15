'use client';

import { useUser } from '@clerk/nextjs';
import { debugUserRoles, getUserRoles, getHighestPriorityRole } from '@/lib/clerk-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function UserRoleDebug() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Role Debug</CardTitle>
          <CardDescription>Loading user information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Role Debug</CardTitle>
          <CardDescription>No user found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const userRoles = getUserRoles(user);
  const highestPriorityRole = getHighestPriorityRole(user);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Role Debug</CardTitle>
        <CardDescription>Current user role information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">User Info</h4>
          <p className="text-sm text-gray-600">
            {user.firstName} {user.lastName} ({user.emailAddresses[0]?.emailAddress})
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Raw Metadata</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(user.publicMetadata, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium mb-2">Parsed Roles</h4>
          <div className="flex gap-2">
            {userRoles.map(role => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Highest Priority Role</h4>
          <Badge variant="default" className="capitalize">
            {highestPriorityRole}
          </Badge>
        </div>

        <div>
          <h4 className="font-medium mb-2">Access Check</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Admin Dashboard:</span>
              <Badge variant={userRoles.includes('admin') ? 'default' : 'secondary'}>
                {userRoles.includes('admin') ? 'Access' : 'Denied'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Trainer Dashboard:</span>
              <Badge variant={userRoles.includes('trainer') ? 'default' : 'secondary'}>
                {userRoles.includes('trainer') ? 'Access' : 'Denied'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Member App:</span>
              <Badge variant="default">Access</Badge>
            </div>
          </div>
        </div>

        <button
          onClick={() => debugUserRoles(user)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Log to Console
        </button>
      </CardContent>
    </Card>
  );
} 