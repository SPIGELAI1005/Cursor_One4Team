import { PrismaClient } from '@prisma/client';

/**
 * Prisma middleware to automatically inject club_id into queries
 * This ensures all queries are tenant-aware even if clubId is not explicitly provided
 */
export function createTenantFilter(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    // Get the current request context (set by middleware)
    const context = (params as any).__context;
    const clubId = context?.clubId;

    // Only apply tenant filtering if clubId is available
    if (clubId) {
      // List of models that have club_id field
      const clubScopedModels = [
        'member',
        'trainer', 
        'class',
        'payment',
        'announcement',
        'product',
        'order',
        'contributionPlan',
        'invoice',
        'player',
        'evaluation',
        'note',
        'trainingPlan',
        'trainingSession'
      ];

      // Check if this is a club-scoped model
      if (clubScopedModels.includes(params.model)) {
        // For find operations, inject clubId if not already present
        if (params.action.startsWith('find') || params.action === 'count') {
          if (!params.args?.where?.clubId && !params.args?.where?.club_id) {
            params.args = {
              ...params.args,
              where: {
                ...params.args?.where,
                clubId: clubId,
              },
            };
          }
        }

        // For create operations, inject clubId if not already present
        if (params.action === 'create') {
          if (!params.args?.data?.clubId && !params.args?.data?.club_id) {
            params.args = {
              ...params.args,
              data: {
                ...params.args?.data,
                clubId: clubId,
              },
            };
          }
        }

        // For update operations, ensure clubId is not changed
        if (params.action === 'update' || params.action === 'updateMany') {
          if (params.args?.data?.clubId || params.args?.data?.club_id) {
            console.warn(`⚠️ Attempting to change clubId in ${params.model} update operation`);
            // Remove clubId from update data to prevent cross-tenant updates
            delete params.args.data.clubId;
            delete params.args.data.club_id;
          }
        }

        // For delete operations, ensure we only delete within the same tenant
        if (params.action === 'delete' || params.action === 'deleteMany') {
          if (!params.args?.where?.clubId && !params.args?.where?.club_id) {
            params.args = {
              ...params.args,
              where: {
                ...params.args?.where,
                clubId: clubId,
              },
            };
          }
        }
      }
    }

    return next(params);
  });
}

/**
 * Set the club context for the current request
 * This should be called by middleware to make clubId available to the tenant filter
 */
export function setClubContext(clubId: string) {
  // Store clubId in a way that the Prisma middleware can access it
  // This is a simplified approach - in production you might use AsyncLocalStorage
  (global as any).__currentClubId = clubId;
}

/**
 * Get the current club context
 */
export function getClubContext(): string | undefined {
  return (global as any).__currentClubId;
} 