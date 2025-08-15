"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const clerk_1 = require("../../../web/lib/services/clerk");
const email_1 = require("../../../web/lib/services/email");
const security_1 = require("../../../web/lib/utils/security");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const clubRegistrationSchema = zod_1.z.object({
    clubName: zod_1.z.string()
        .min(2, "Club name must be at least 2 characters")
        .max(100, "Club name must be less than 100 characters"),
    sport: zod_1.z.string()
        .min(1, "Please select a primary sport"),
    foundedYear: zod_1.z.string().optional(),
    description: zod_1.z.string().max(500).optional(),
    address: zod_1.z.string().max(200).optional(),
    city: zod_1.z.string()
        .min(2, "City must be at least 2 characters")
        .max(100, "City must be less than 100 characters"),
    postalCode: zod_1.z.string().max(20).optional(),
    country: zod_1.z.string()
        .min(2, "Country must be at least 2 characters")
        .max(100, "Country must be less than 100 characters"),
    phone: zod_1.z.string().max(20).optional(),
    email: zod_1.z.string()
        .email("Please enter a valid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must be less than 100 characters"),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    memberCount: zod_1.z.string()
        .min(1, "Please select member count"),
    ageGroups: zod_1.z.array(zod_1.z.string())
        .min(1, "Please select at least one age group"),
    facilities: zod_1.z.array(zod_1.z.string()).optional(),
    achievements: zod_1.z.string().max(300).optional(),
    adminName: zod_1.z.string()
        .min(2, "Admin name must be at least 2 characters")
        .max(100, "Admin name must be less than 100 characters"),
    adminEmail: zod_1.z.string()
        .email("Please enter a valid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must be less than 100 characters"),
    adminPhone: zod_1.z.string().max(20).optional(),
    password: zod_1.z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: zod_1.z.string()
        .min(1, "Please confirm your password"),
    termsAccepted: zod_1.z.boolean()
        .refine((val) => val === true, "You must accept the terms and conditions"),
    marketingEmails: zod_1.z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
router.post('/club', async (req, res) => {
    try {
        const validationResult = clubRegistrationSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationResult.error.errors
            });
        }
        const data = validationResult.data;
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
        const hashedPassword = await security_1.SecurityUtils.hashPassword(data.password);
        const result = await prisma.$transaction(async (tx) => {
            const club = await tx.club.create({
                data: {
                    name: data.clubName,
                    sport: data.sport,
                    foundedYear: data.foundedYear ? parseInt(data.foundedYear) : null,
                    description: data.description || '',
                    address: data.address || '',
                    city: data.city,
                    postalCode: data.postalCode || '',
                    country: data.country,
                    phone: data.phone || '',
                    email: data.email,
                    website: data.website || '',
                    memberCount: data.memberCount,
                    ageGroups: data.ageGroups,
                    facilities: data.facilities || [],
                    achievements: data.achievements || '',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            const adminUser = await tx.user.create({
                data: {
                    email: data.adminEmail,
                    name: data.adminName,
                    phone: data.adminPhone || '',
                    role: 'admin',
                    clubId: club.id,
                    passwordHash: hashedPassword,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            await tx.clubAdmin.create({
                data: {
                    clubId: club.id,
                    userId: adminUser.id,
                    role: 'owner',
                    createdAt: new Date()
                }
            });
            return { club, adminUser };
        });
        const [firstName, ...lastNameParts] = data.adminName.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        const clerkResult = await clerk_1.ClerkService.createUser({
            emailAddress: data.adminEmail,
            firstName,
            lastName,
            password: data.password,
            publicMetadata: {
                role: 'admin',
                clubId: result.club.id,
                clubName: result.club.name,
            },
            privateMetadata: {
                userId: result.adminUser.id,
            },
        });
        if (!clerkResult.success) {
            console.error('Clerk user creation failed:', clerkResult.error);
        }
        await email_1.EmailService.sendWelcomeEmail({
            to: data.adminEmail,
            name: data.adminName,
            clubName: data.clubName,
        });
        res.status(201).json({
            success: true,
            message: 'Club registered successfully',
            data: {
                clubId: result.club.id,
                adminId: result.adminUser.id,
                clubName: result.club.name
            }
        });
    }
    catch (error) {
        console.error('Club registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to register club. Please try again.'
        });
    }
});
router.get('/check-email', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Email parameter is required'
            });
        }
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
    }
    catch (error) {
        console.error('Email check error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/check-club-name', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Club name parameter is required'
            });
        }
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
    }
    catch (error) {
        console.error('Club name check error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.post('/request-password-reset', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        const user = await prisma.user.findFirst({
            where: { email: email.toLowerCase() }
        });
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account with this email exists, a password reset link has been sent.'
            });
        }
        const resetToken = security_1.SecurityUtils.generatePasswordResetToken();
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetTokenExpiry: resetTokenExpiry,
            }
        });
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
        await email_1.EmailService.sendPasswordResetEmail({
            to: user.email,
            name: user.name,
            resetUrl,
        });
        res.json({
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent.'
        });
    }
    catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                error: 'Token and password are required'
            });
        }
        const passwordValidation = security_1.SecurityUtils.validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'Password does not meet requirements',
                details: passwordValidation.errors
            });
        }
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
        const hashedPassword = await security_1.SecurityUtils.hashPassword(password);
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
    }
    catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=register.js.map