import { z } from "zod";

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  clubName: z.string()
    .min(2, "Club name must be at least 2 characters")
    .max(100, "Club name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-'&.()]+$/, "Club name contains invalid characters"),
  sport: z.string()
    .min(1, "Please select a primary sport"),
  foundedYear: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const year = parseInt(val);
      return year >= 1800 && year <= new Date().getFullYear();
    }, "Founded year must be between 1800 and current year"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

// Step 2: Contact Information
export const contactInfoSchema = z.object({
  address: z.string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "City contains invalid characters"),
  postalCode: z.string()
    .max(20, "Postal code must be less than 20 characters")
    .optional(),
  country: z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters"),
  phone: z.string()
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''));
    }, "Please enter a valid phone number"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  website: z.string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
});

// Step 3: Club Details
export const clubDetailsSchema = z.object({
  memberCount: z.string()
    .min(1, "Please select member count"),
  ageGroups: z.array(z.string())
    .min(1, "Please select at least one age group"),
  facilities: z.array(z.string())
    .optional(),
  achievements: z.string()
    .max(300, "Achievements must be less than 300 characters")
    .optional(),
});

// Step 4: Account Setup
export const accountSetupSchema = z.object({
  adminName: z.string()
    .min(2, "Admin name must be at least 2 characters")
    .max(100, "Admin name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Admin name contains invalid characters"),
  adminEmail: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  adminPhone: z.string()
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''));
    }, "Please enter a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  termsAccepted: z.boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
  marketingEmails: z.boolean()
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Complete registration schema
export const clubRegistrationSchema = z.object({
  // Step 1
  clubName: basicInfoSchema.shape.clubName,
  sport: basicInfoSchema.shape.sport,
  foundedYear: basicInfoSchema.shape.foundedYear,
  description: basicInfoSchema.shape.description,
  
  // Step 2
  address: contactInfoSchema.shape.address,
  city: contactInfoSchema.shape.city,
  postalCode: contactInfoSchema.shape.postalCode,
  country: contactInfoSchema.shape.country,
  phone: contactInfoSchema.shape.phone,
  email: contactInfoSchema.shape.email,
  website: contactInfoSchema.shape.website,
  
  // Step 3
  memberCount: clubDetailsSchema.shape.memberCount,
  ageGroups: clubDetailsSchema.shape.ageGroups,
  facilities: clubDetailsSchema.shape.facilities,
  achievements: clubDetailsSchema.shape.achievements,
  
  // Step 4
  adminName: accountSetupSchema.shape.adminName,
  adminEmail: accountSetupSchema.shape.adminEmail,
  adminPhone: accountSetupSchema.shape.adminPhone,
  password: accountSetupSchema.shape.password,
  confirmPassword: accountSetupSchema.shape.confirmPassword,
  termsAccepted: accountSetupSchema.shape.termsAccepted,
  marketingEmails: accountSetupSchema.shape.marketingEmails,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Step validation schemas
export const stepValidationSchemas = {
  1: basicInfoSchema,
  2: contactInfoSchema,
  3: clubDetailsSchema,
  4: accountSetupSchema,
};

// Type definitions
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type ClubDetailsFormData = z.infer<typeof clubDetailsSchema>;
export type AccountSetupFormData = z.infer<typeof accountSetupSchema>;
export type ClubRegistrationFormData = z.infer<typeof clubRegistrationSchema>;

// Validation helper functions
export const validateStep = (step: number, data: any) => {
  const schema = stepValidationSchemas[step as keyof typeof stepValidationSchemas];
  if (!schema) {
    throw new Error(`Invalid step: ${step}`);
  }
  return schema.safeParse(data);
};

export const validateCompleteForm = (data: any) => {
  return clubRegistrationSchema.safeParse(data);
};

// Error message helpers
export const getFieldError = (errors: z.ZodError, fieldName: string): string | undefined => {
  const fieldError = errors.errors.find(error => error.path.includes(fieldName));
  return fieldError?.message;
};

export const hasFieldError = (errors: z.ZodError | null, fieldName: string): boolean => {
  if (!errors) return false;
  return errors.errors.some(error => error.path.includes(fieldName));
}; 