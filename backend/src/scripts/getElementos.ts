//backend\src\scripts\getElementos.tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getElemento() {
  try {
    const elemento = await prisma.elementos.findUnique({
      where: {
        id: 1, // ID específico
      },
    });

    if (elemento) {
      console.log('Elemento encontrado:', elemento);
    } else {
      console.log('No se encontró ningún elemento con el ID especificado.');
    }
  } catch (error) {
    console.error('Error al obtener el elemento:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getElemento();
