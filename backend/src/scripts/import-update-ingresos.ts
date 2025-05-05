//backend\src\scripts\import-update-ingresos.ts
//npx ts-node backend/src/scripts/import-update-ingresos.ts npx prisma migrate reset
//SELECT DISTINCT establecimiento FROM ingresos; es para saber que nombres de complejos hay
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

type IngresoData = {
  lpu: string | number;
  apellido: string | null | undefined;
  nombres: string | null | undefined;
  fechaHoraIng: string;
  establecimiento: string;
  modulo_ur: string | number | null | undefined;
  pabellon: string | number | null | undefined;
  celda: string | number | null | undefined;
};

const establecimientoMap: Record<string, string> = {
  'PRISION REGIONAL DEL NORTE U-7': 'U. 7',
  'INSTITUTO PENITENCIARIO FEDERAL "NUESTRA SEÑORA DEL ROSARIO DE RIO BLANCO Y PAYPAYA". 8':
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
  'COLONIA PENAL DE VIEDMA (U.12)': 'U. 12',
  'COLONIA PENAL SUBPREFECTO MIGUEL ROCHA U-5': 'U. 5',
  'COMPLEJO FEDERAL DE JOVENES ADULTOS': 'C.F.J.A.',
  'COMPLEJO PENITENCIARIO FEDERAL DE LA CIUDAD AUTONOMA DE BUENOS AIRES':
    'C.A.B.A',
  'COMPLEJO PENITENCIARIO FEDERAL Nº 1 DE EZEIZA': 'C.P.F. I',
  'COMPLEJO PENITENCIARIO FEDERAL Nº 2 DE MARCOS PAZ': 'C.P.F. II',
  'COLONIA PENAL DE VIEDMA (U-12)': 'U. 12',
  'COMPLEJO PENITENCIARIO FEDERAL VI DE CUYO - MENDOZA': 'C.P.F. VI',
  'COMPLEJO PENITENCIARIO FEDERAL VII - NUESTRA SEÑORA DEL ROSARIO DE SAN NICOLAS (EX-UNIDAD 31)':
    'C.P.F. VII',
  'COMPLEJO PENITENCIARIO FEDERAL III NOA - INSTITUTO CORRECCIONAL DE VARONES':
    'C.P.F. III',
  'COMPLEJO PENITENCIARIO FEDERAL III NOA - INSTITUTO CORRECCIONAL DE MUJERES':
    'C.P.F. III',
  'INSTITUTO CORRECCIONAL ABIERTO DE GENERAL PICO U-25': 'U. 25',
};

function mapEstablecimiento(value: string): string {
  if (!value) return 'Desconocido';
  const normalizedValue = value.trim().toUpperCase();
  return establecimientoMap[normalizedValue] || value;
}

function normalizeLPU(lpu: string | number): string {
  if (typeof lpu === 'number') return lpu.toString();
  return lpu
    .replace(/\./g, '')
    .replace(/\/[CP]$/i, '')
    .trim();
}

function parseDate(dateValue: any): Date | null {
  if (typeof dateValue === 'string') {
    const [day, month, year] = dateValue.split('/').map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    }
  } else if (typeof dateValue === 'number') {
    const excelEpoch = new Date(Date.UTC(1900, 0, 1));
    return new Date(excelEpoch.getTime() + (dateValue - 2) * 86400000);
  }
  console.warn(`Fecha inválida detectada: ${dateValue}.`);
  return new Date(Date.UTC(1900, 0, 1));
}

async function main() {
  const filePath =
    process.env.EXCEL_FILE_PATH || path.join(__dirname, 'ok1.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: IngresoData[] = XLSX.utils.sheet_to_json(sheet);

  let createdCount = 0;
  let updatedCount = 0;
  let rejectedCount = 0;
  const rejectedRecords: IngresoData[] = [];

  for (const row of data) {
    try {
      row.fechaHoraIng = row.fechaHoraIng || '01/01/1970';
      row.lpu = row.lpu ? normalizeLPU(row.lpu) : 'N/A';
      row.celda = row.celda ? row.celda.toString() : 'N/A';
      row.pabellon = row.pabellon ? row.pabellon.toString() : 'N/A';
      row.modulo_ur = row.modulo_ur ? row.modulo_ur.toString() : 'N/A';
      row.establecimiento = mapEstablecimiento(
        row.establecimiento || 'Desconocido',
      );
      const apellido = row.apellido ? row.apellido.trim() : 'Desconocido';
      const nombres = row.nombres ? row.nombres.trim() : 'Desconocido';
      const fechaHoraIng = parseDate(row.fechaHoraIng);

      const uniqueIdentifier = `${apellido}_${nombres}_${row.fechaHoraIng}`;

      const existingIngreso = await prisma.ingresos.findUnique({
        where: { identificadorUnico: uniqueIdentifier },
      });

      if (existingIngreso) {
        await prisma.ingresos.update({
          where: { identificadorUnico: uniqueIdentifier },
          data: {
            lpu: row.lpu,
            apellido,
            nombres,
            fechaHoraIng,
            establecimiento: row.establecimiento,
            modulo_ur: row.modulo_ur,
            pabellon: row.pabellon,
            celda: row.celda,
            condicion: 'Alojado',
          },
        });
        updatedCount++;
      } else {
        await prisma.ingresos.create({
          data: {
            identificadorUnico: uniqueIdentifier,
            lpu: row.lpu,
            apellido,
            nombres,
            fechaHoraIng,
            establecimiento: row.establecimiento,
            modulo_ur: row.modulo_ur,
            pabellon: row.pabellon,
            celda: row.celda,
            condicion: 'Alojado',
          },
        });
        createdCount++;
      }
    } catch (error) {
      console.error(
        `Error procesando registro ${JSON.stringify(row)}: ${error.message}`,
      );
      rejectedRecords.push(row);
      rejectedCount++;
    }
  }

  console.log(`Registros creados: ${createdCount}`);
  console.log(`Registros actualizados: ${updatedCount}`);
  console.log(`Registros rechazados: ${rejectedCount}`);

  if (rejectedRecords.length > 0) {
    rejectedRecords.forEach((record, index) => {
      console.log(
        `Registro rechazado (${index + 1}): ${JSON.stringify(record)}`,
      );
    });
  }
}

main()
  .catch((e) => {
    console.error('Error en el script import-update-ingresos:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
