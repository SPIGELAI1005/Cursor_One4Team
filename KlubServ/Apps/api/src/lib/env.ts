import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4001),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().min(1),

  CLERK_JWT_AUDIENCE: z.string().min(1).default('one4team'),
  CLERK_ISSUER_URL: z.string().url().optional(),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  CLERK_JWT_AUDIENCE: process.env.CLERK_JWT_AUDIENCE,
  CLERK_ISSUER_URL: process.env.CLERK_ISSUER_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
});

