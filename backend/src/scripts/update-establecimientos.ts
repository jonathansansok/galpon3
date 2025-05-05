//npx ts-node backend/src/scripts/update-establecimientos.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo de valores de establecimiento
const establecimientoMap: Record<string, string> = {
  'PRISION REGIONAL DEL NORTE U-7': 'U. 7',
  'INSTITUTO PENITENCIARIO FEDERAL "NUESTRA SEÑORA DEL ROSARIO DE RIO BLANCO Y PAYPAYA" U. 8':
    'U. 8',
  'INSTITUTO PENITENCIARIO FEDERAL DE SALTA SR Y VIRGEN DEL MILAGRO U-16':
    'U. 16',
  'INSTITUTO PENAL FEDERAL DE CAMPO DE MAYO U-34': 'U. 34',
  'INSTITUTO PENAL FEDERAL COLONIA PINTO (U.35)': 'U. 35',
  'INSTITUTO DE SEGURIDAD Y RESOCIALIZACION U-6': 'U. 6',
  'INSTITUTO DE JOVENES ADULTOS DR. JULIO ANTONIO ALFONSIN U-30': 'U. 30',
  'INSTITUTO CORRECCIONAL DE MUJERES NUESTRA SEÑORA DEL CARMEN U-13': 'U. 30',
  'COLONIA PENAL DE EZEIZA-U19': 'U. 19',
  'CARCEL DE ESQUEL SUBALCAIDE ROSARIO ABEL MUÑOZ U-14': 'U. 14',
  'CARCEL DE FORMOSA U-10': 'U. 10',
  'CARCEL DE RIO GALLEGOS U-15': 'U. 15',
  'CARCEL FEDERAL DE JUJUY "VIRGEN DE PUNTA CORRAL" U.22': 'U. 22',
  'UNIDAD 17': 'U. 17',
  'COLONIA PENAL DE PRESIDENCIA ROQUE SAENZ PEÑA U-11': 'U. 11',
  'COLONIA PENAL DE SANTA ROSA U-4': 'U. 4',
  'COLONIA PENAL DE VIEDMA (U-12)': 'U. 12',
  'COLONIA PENAL SUBPREFECTO MIGUEL ROCHA U-5': 'U. 5',
  'COMPLEJO FEDERAL DE JOVENES ADULTOS': 'C.F.J.A.',
  'COMPLEJO PENITENCIARIO FEDERAL DE LA CIUDAD AUTONOMA DE BUENOS AIRES':
    'C.A.B.A',
  'COMPLEJO PENITENCIARIO FEDERAL Nº 1 DE EZEIZA': 'C.P.F. I"',
  'COMPLEJO PENITENCIARIO FEDERAL Nº 2 DE MARCOS PAZ': 'C.P.F. II"',
  'COMPLEJO PENITENCIARIO FEDERAL VI DE CUYO - MENDOZA': 'C.P.F. VI"',
  'COMPLEJO PENITENCIARIO FEDERAL VII - NUESTRA SEÑORA DEL ROSARIO DE SAN NICOLAS (EX-UNIDAD 31)':
    'C.P.F. VII',
  'COMPLEJO PENITENCIARIO FEDERAL III NOA - INSTITUTO CORRECCIONAL DE VARONES':
    'C.P.F. III"',
  'COMPLEJO PENITENCIARIO FEDERAL III NOA - INSTITUTO CORRECCIONAL DE MUJERES':
    'C.P.F. III"',
  'INSTITUTO CORRECCIONAL ABIERTO DE GENERAL PICO U-25': 'U. 25',
};

// Función para mapear el establecimiento
function mapEstablecimiento(value: string): string {
  return establecimientoMap[value] || value; // Si no está en el mapeo, devuelve el valor original
}

async function main() {
  try {
    // Obtener todos los registros de la tabla Ingresos
    const ingresos = await prisma.ingresos.findMany();

    for (const ingreso of ingresos) {
      const nuevoEstablecimiento = mapEstablecimiento(ingreso.establecimiento);

      // Solo actualizar si el establecimiento ha cambiado
      if (ingreso.establecimiento !== nuevoEstablecimiento) {
        await prisma.ingresos.update({
          where: { id: ingreso.id },
          data: { establecimiento: nuevoEstablecimiento },
        });
        console.log(
          `Actualizado: Registro con ID ${ingreso.id}, establecimiento cambiado a '${nuevoEstablecimiento}'`,
        );
      }
    }
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

main();
