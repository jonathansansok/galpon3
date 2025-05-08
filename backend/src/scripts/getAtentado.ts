//backend\src\scripts\getAtentado.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getAtentadoById() {
  try {
    // Obtener la fila con id = 3
    const atentado = await prisma.atentados.findUnique({
      where: { id: 3 },
    });

    if (!atentado) {
      return;
    }

    // Mostrar todos los datos de la fila
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
getAtentadoById();
