import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Mock data for club staff directory
const mockStaff = [
  {
    id: '1',
    name: 'Dr. Hans Müller',
    department: 'Administration',
    role: 'Club President',
    email: 'president@club.com',
    phone: '+49 89 123 4567',
    office: 'Main Office - Room 101',
    availability: 'Mon-Fri 9:00-17:00',
    isActive: true
  },
  {
    id: '2',
    name: 'Maria Schmidt',
    department: 'Administration',
    role: 'Vice President',
    email: 'vice-president@club.com',
    phone: '+49 89 123 4568',
    office: 'Main Office - Room 102',
    availability: 'Mon-Fri 9:00-17:00',
    isActive: true
  },
  {
    id: '3',
    name: 'Thomas Weber',
    department: 'Finance',
    role: 'Treasurer',
    email: 'treasurer@club.com',
    phone: '+49 89 123 4569',
    office: 'Finance Office - Room 201',
    availability: 'Mon-Fri 10:00-16:00',
    isActive: true
  },
  {
    id: '4',
    name: 'Anna Fischer',
    department: 'Training',
    role: 'Head Trainer',
    email: 'head-trainer@club.com',
    phone: '+49 89 123 4570',
    office: 'Training Center - Office 1',
    availability: 'Mon-Sat 8:00-18:00',
    isActive: true
  },
  {
    id: '5',
    name: 'Michael Bauer',
    department: 'Training',
    role: 'Senior Trainer',
    email: 'senior-trainer@club.com',
    phone: '+49 89 123 4571',
    office: 'Training Center - Office 2',
    availability: 'Mon-Fri 14:00-22:00',
    isActive: true
  },
  {
    id: '6',
    name: 'Sarah Klein',
    department: 'Finance',
    role: 'Accountant',
    email: 'accountant@club.com',
    phone: '+49 89 123 4572',
    office: 'Finance Office - Room 202',
    availability: 'Mon-Fri 9:00-17:00',
    isActive: true
  },
  {
    id: '7',
    name: 'Peter Wagner',
    department: 'Maintenance',
    role: 'Facility Manager',
    email: 'facility@club.com',
    phone: '+49 89 123 4573',
    office: 'Maintenance Office',
    availability: 'Mon-Sun 7:00-19:00',
    isActive: true
  },
  {
    id: '8',
    name: 'Lisa Hoffmann',
    department: 'Administration',
    role: 'Office Manager',
    email: 'office@club.com',
    phone: '+49 89 123 4574',
    office: 'Main Office - Reception',
    availability: 'Mon-Fri 8:00-18:00',
    isActive: true
  }
];

// Validation schema for query parameters
const getStaffSchema = z.object({
  department: z.enum(['Administration', 'Finance', 'Training', 'Maintenance', 'all']).optional(),
  role: z.string().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default(10),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional().default(0),
  search: z.string().optional()
});

/**
 * GET /api/official/staff
 * Get club staff directory for officials
 */
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = getStaffSchema.parse(req.query);
    
    // Filter staff based on query parameters
    const filteredStaff = mockStaff.filter(staff => {
      if (validatedQuery.department && validatedQuery.department !== 'all') {
        if (staff.department !== validatedQuery.department) {
          return false;
        }
      }
      
      if (validatedQuery.role) {
        if (!staff.role.toLowerCase().includes(validatedQuery.role.toLowerCase())) {
          return false;
        }
      }
      
      if (validatedQuery.isActive !== undefined) {
        if (staff.isActive !== validatedQuery.isActive) {
          return false;
        }
      }
      
      if (validatedQuery.search) {
        const searchTerm = validatedQuery.search.toLowerCase();
        const matchesName = staff.name.toLowerCase().includes(searchTerm);
        const matchesRole = staff.role.toLowerCase().includes(searchTerm);
        const matchesDepartment = staff.department.toLowerCase().includes(searchTerm);
        const matchesEmail = staff.email.toLowerCase().includes(searchTerm);
        
        if (!matchesName && !matchesRole && !matchesDepartment && !matchesEmail) {
          return false;
        }
      }
      
      return true;
    });

    // Apply pagination and sorting
    const total = filteredStaff.length;
    const staff = filteredStaff
      .slice(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit)
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: {
        staff,
        pagination: {
          total,
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          hasMore: validatedQuery.offset + validatedQuery.limit < total
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }
    
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/official/staff/:id
 * Get a specific staff member by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const staffMember = mockStaff.find(s => s.id === id);
    
    if (!staffMember) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }
    
    res.json({
      success: true,
      data: staffMember
    });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/official/staff/departments
 * Get list of departments
 */
router.get('/departments', async (req, res) => {
  try {
    const departments = [...new Set(mockStaff.map(staff => staff.department))].sort();
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 