import { PrismaClient } from '@prisma/client';

// Define a global variable to store the Prisma instance across hot-reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a new Prisma client, or use the existing one if it's already running
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Only save the instance globally if we are in development mode
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;