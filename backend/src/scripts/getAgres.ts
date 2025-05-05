//backend\src\scripts\getMani.tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getAgresion() {
  try {
    const agresion = await prisma.agresiones.findUnique({
      where: {
        id: 7, // ID específico
      },
    });

    if (agresion) {
      console.log('manifestacion encontrado:', agresion);
    } else {
      console.log('No se encontró ningún manife con el ID especificado.');
    }
  } catch (error) {
    console.error('Error al obtener el agresion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getAgresion();
