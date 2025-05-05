import { PrismaClient } from '@prisma/client';
// npx ts-node backend/src/scripts/reset-ingresos.ts
const prisma = new PrismaClient();

async function resetIngresosTable() {
  try {
    // Vaciar la tabla Ingresos
    await prisma.ingresos.deleteMany({});
    console.log(
      'Todos los registros de la tabla Ingresos han sido eliminados.',
    );

    // Reiniciar el contador de IDs
    await prisma.$executeRaw`ALTER TABLE ingresos AUTO_INCREMENT = 1;`;
    console.log(
      'El contador de IDs de la tabla Ingresos ha sido reiniciado a 1.',
    );
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

resetIngresosTable();
