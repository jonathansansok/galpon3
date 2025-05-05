import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getManifestacionCruda() {
  try {
    // Obtener la primera inserción con id = 1
    const manifestacion = await prisma.manifestaciones.findUnique({
      where: { id: 1 },
    });

    if (!manifestacion) {
      return;
    }

    // Mostrar los datos crudos de las columnas internosinvolucrado y personalinvolucrado
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
getManifestacionCruda();
