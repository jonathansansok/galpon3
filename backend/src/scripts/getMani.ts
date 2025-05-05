//backend\src\scripts\getMani.tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getMani() {
  try {
    const manifestacion = await prisma.manifestaciones.findUnique({
      where: {
        id: 7, // ID específico
      },
    });

    if (manifestacion) {
      console.log('manifestacion encontrado:', manifestacion);
    } else {
      console.log('No se encontró ningún manife con el ID especificado.');
    }
  } catch (error) {
    console.error('Error al obtener el manifestacion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getMani();
