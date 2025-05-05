import { PrismaClient } from '@prisma/client';
//  npx ts-node backend/src/scripts/truncate-ingresos.ts
const prisma = new PrismaClient();

async function main() {
  await prisma.ingresos.deleteMany(); // Elimina todos los registros de la tabla
}

main()
  .catch((e) => {
    console.error('Error al truncar la tabla ingresos:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
