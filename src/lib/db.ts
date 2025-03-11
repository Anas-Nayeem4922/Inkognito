import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
  client: PrismaClientSingleton | undefined;
};

export const client = globalForPrisma.client ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.client = client;
