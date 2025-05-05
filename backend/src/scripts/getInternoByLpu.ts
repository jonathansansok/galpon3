import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getInternoByLpu(lpu: string) {
  try {
    const interno = await prisma.ingresos.findFirst({
      where: {
        lpu: lpu,
      },
    });

    if (!interno) {
      console.log('No se encontró ningún interno con el LPU proporcionado.');
    } else {
      console.log('Interno encontrado:', interno);
    }
  } catch (error) {
    console.error('Error al buscar el interno:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getInternoByLpu('438979');
