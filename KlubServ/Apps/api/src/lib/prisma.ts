import { PrismaClient } from '@prisma/client';
import { createTenantFilter } from './tenantFilter';

// Create a single PrismaClient instance that can be shared throughout the app
const prisma = new PrismaClient();

// Apply tenant filtering middleware
createTenantFilter(prisma);

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
export default prisma; 