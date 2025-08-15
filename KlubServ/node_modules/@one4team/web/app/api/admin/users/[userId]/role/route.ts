import { NextRequest, NextResponse } from 'next/server';
import { setUserRoleInClerk } from '@/lib/clerk-utils';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'trainer', 'member']),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    
    // Validate request body
    const { role } = updateRoleSchema.parse(body);
    
    // Update user role in Clerk
    await setUserRoleInClerk(userId, role);
    
    return NextResponse.json({ 
      message: 'User role updated successfully',
      userId,
      role 
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 