import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { TenantProvisioningService } from '../../services/tenantProvisioning';
import { StripeService } from '../../services/stripe';
import { SecurityUtils } from '../../utils/security';
import { EmailService } from '../../services/email';

const router = Router();

// Club registration schema for API validation
const clubRegistrationSchema = z.object({
  // Step 1: Basic Information
  clubName: z.string()
    .min(2, "Club name must be at least 2 characters")
    .max(100, "Club name must be less than 100 characters"),
  sport: z.string()
    .min(1, "Please select a primary sport"),
  foundedYear: z.string().optional(),
  description: z.string().max(500).optional(),
  
  // Step 2: Contact Information
  address: z.string().max(200).optional(),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  postalCode: z.string().max(20).optional(),
  country: z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters"),
  phone: z.string().max(20).optional(),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  website: z.string().url().optional().or(z.literal("")),
  
  // Step 3: Club Details
  memberCount: z.string()
    .min(1, "Please select member count"),
  ageGroups: z.array(z.string())
    .min(1, "Please select at least one age group"),
  facilities: z.array(z.string()).optional(),
  achievements: z.string().max(300).optional(),
  
  // Step 4: Account Setup
  adminName: z.string()
    .min(2, "Admin name must be at least 2 characters")
    .max(100, "Admin name must be less than 100 characters"),
  adminEmail: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  adminPhone: z.string().max(20).optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  termsAccepted: z.boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
  marketingEmails: z.boolean().optional(),
  
  // Step 5: Billing Information
  planId: z.string()
    .min(1, "Please select a billing plan"),
  seats: z.number()
    .min(1, "At least 1 seat is required")
    .max(1000, "Maximum 1000 seats allowed"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// POST /api/public/register/club
router.post('/club', async (req, res) => {
  try {
    // Validate request body
    const validationResult = clubRegistrationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
    }

    const data = validationResult.data;

    // Check if club with same name already exists
    const existingClub = await prisma.club.findFirst({
      where: {
        name: data.clubName
      }
    });

    if (existingClub) {
      return res.status(409).json({
        success: false,
        error: 'Club with this name already exists'
      });
    }

    // Check if admin email already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: data.adminEmail
      }
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        error: 'Admin email already registered'
      });
    }

    // Provision the tenant using the new service
    const provisionedTenant = await TenantProvisioningService.provisionTenant({
      // Club information
      clubName: data.clubName,
      sport: data.sport,
      foundedYear: data.foundedYear,
      description: data.description,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website,
      memberCount: data.memberCount,
      ageGroups: data.ageGroups,
      facilities: data.facilities,
      achievements: data.achievements,
      
      // Admin information
      adminName: data.adminName,
      adminEmail: data.adminEmail,
      adminPhone: data.adminPhone,
      password: data.password,
      
      // Billing information
      planId: data.planId,
      seats: data.seats,
    });

    res.status(201).json({
      success: true,
      message: 'Club registered successfully',
      data: {
        clubId: provisionedTenant.clubId,
        adminId: provisionedTenant.adminId,
        clubName: provisionedTenant.clubName,
        subdomain: provisionedTenant.subdomain,
        stripeCustomerId: provisionedTenant.stripeCustomerId,
        subscriptionId: provisionedTenant.subscriptionId,
      }
    });

  } catch (error) {
    console.error('Club registration error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to register club. Please try again.'
    });
  }
});

// GET /api/public/register/check-email
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Email parameter is required'
      });
    }

    // Check if email exists in users table
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase()
      }
    });

    res.json({
      success: true,
      available: !existingUser,
      message: existingUser ? 'Email already registered' : 'Email available'
    });

  } catch (error) {
    console.error('Email check error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/public/register/check-club-name
router.get('/check-club-name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Club name parameter is required'
      });
    }

    // Check if club name exists
    const existingClub = await prisma.club.findFirst({
      where: {
        name: name
      }
    });

    res.json({
      success: true,
      available: !existingClub,
      message: existingClub ? 'Club name already taken' : 'Club name available'
    });

  } catch (error) {
    console.error('Club name check error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/public/register/request-password-reset
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = SecurityUtils.generatePasswordResetToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
      }
    });

    // Send password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    await EmailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/public/register/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token and password are required'
      });
    }

    // Validate password strength
    const passwordValidation = SecurityUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await SecurityUtils.hashPassword(password);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 