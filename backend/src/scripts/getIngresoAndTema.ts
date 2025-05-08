import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getIngresoAndTema() {
  try {
    // Obtener el ingreso con id = 1
    const ingreso = await prisma.ingresos.findUnique({
      where: { id: 1 },
    });

    if (!ingreso) {
      console.log('Ingreso con id = 1 no encontrado.');
    } else {
      console.log('Ingreso encontrado:', ingreso);
    }

    // Obtener el tema/móvil con id = 1
    const tema = await prisma.temas.findUnique({
      where: { id: 1 },
    });

    if (!tema) {
      console.log('Tema/Móvil con id = 1 no encontrado.');
    } else {
      console.log('Tema/Móvil encontrado:', tema);
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
getIngresoAndTema();
