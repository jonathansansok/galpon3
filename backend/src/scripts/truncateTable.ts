import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function truncateTable() {
  try {
    await prisma.$executeRaw`TRUNCATE TABLE Ingresos;`;
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

truncateTable();
