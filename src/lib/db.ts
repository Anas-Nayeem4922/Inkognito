import { PrismaClient } from '@prisma/client';

declare global {
  var client: PrismaClient | undefined;
}

export const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === 'production') {
  global.client = client;
} else {
  global.client = client;
}
