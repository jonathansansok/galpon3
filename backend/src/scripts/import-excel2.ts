// backend\src\scripts\import-excel2.ts
// ejecutar con npx ts-node import-excel2.ts o npx ts-node backend/src/scripts/import-excel2.ts desde la raiz recorda que tenes que poner formato de fechas personalizada dd/mm/yyyy
// backend\src\scripts\import-excel2.ts
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Definir el tipo para los datos del Excel
type IngresoData = {
  lpu: string | number;
  apellido: string;
  nombres: string;
  fechaHoraIng: string; // Fecha en formato d/m/yyyy
  establecimiento: string;
  modulo_ur: string | number | null | undefined; // Asegúrate de incluir todos los posibles tipos
  pabellon: string | number | null | undefined;
  celda: string | number | null | undefined;
};

// Ruta del archivo JSON
const jsonFilePath = path.resolve(
  __dirname,
  '../../../frontend/public/data/json/alojs.json',
);

// Leer y parsear el archivo JSON
function readJsonFile(filePath: string): any {
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }
  return {};
}

// Guardar cambios en el archivo JSON
function writeJsonFile(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Función para verificar y agregar un nuevo módulo al JSON
function ensureModuloExists(
  jsonData: any,
  establecimiento: string,
  modulo_ur: string,
): void {
  if (!jsonData[establecimiento]) {
    jsonData[establecimiento] = {};
  }
  if (!jsonData[establecimiento][modulo_ur]) {
    jsonData[establecimiento][modulo_ur] = ['Nuevo valor']; // Valor predeterminado
  }
}

// Función para convertir una fecha en formato d/m/yyyy a un objeto Date
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
  return new Date(Date.UTC(1970, 0, 1)); // Fecha estándar
}

// Función para normalizar el valor de lpu
function normalizeLPU(lpu: string | number): string {
  if (typeof lpu === 'number') {
    return lpu.toString();
  }
  return lpu
    .replace(/\./g, '') // Eliminar puntos
    .replace(/\/[CP]$/i, '') // Eliminar sufijos como /C o /P (insensible a mayúsculas)
    .trim(); // Eliminar espacios en blanco
}

// Función para generar el identificador único
function generateUniqueIdentifier(row: IngresoData): string {
  return `${row.apellido.trim()}_${row.nombres.trim()}_${row.fechaHoraIng}`;
}

async function main() {
  const filePath = path.join(__dirname, 'ok1.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: IngresoData[] = XLSX.utils.sheet_to_json(sheet);

  // Leer el archivo JSON
  const jsonData = readJsonFile(jsonFilePath);

  for (const row of data) {
    try {
      // Depuración: Mostrar el valor de row.modulo_ur antes de procesarlo

      // Validar y normalizar modulo_ur
      row.modulo_ur =
        typeof row.modulo_ur === 'string'
          ? row.modulo_ur.trim()
          : row.modulo_ur !== undefined && row.modulo_ur !== null
            ? row.modulo_ur.toString()
            : 'N/A'; // Asignar "N/A" si está vacío o no es válido

      row.fechaHoraIng = row.fechaHoraIng || '01/01/1970'; // Fecha estándar
      row.lpu =
        row.lpu !== undefined && row.lpu !== null
          ? normalizeLPU(row.lpu)
          : 'N/A'; // Normalizar lpu
      row.celda =
        row.celda !== undefined && row.celda !== null
          ? row.celda.toString()
          : 'N/A'; // Validar celda
      row.pabellon =
        row.pabellon !== undefined && row.pabellon !== null
          ? row.pabellon.toString()
          : 'N/A'; // Convertir pabellon a cadena

      const fechaHoraIng = parseDate(row.fechaHoraIng);
      const uniqueIdentifier = generateUniqueIdentifier(row);

      // Verificar y agregar módulo al JSON si no existe
      ensureModuloExists(jsonData, row.establecimiento, row.modulo_ur);

      const existingIngreso = await prisma.ingresos.findUnique({
        where: { identificadorUnico: uniqueIdentifier },
      });

      if (existingIngreso) {
        // Actualizar registro existente
        const updates: Record<string, any> = {};
        if (existingIngreso.modulo_ur !== row.modulo_ur)
          updates.modulo_ur = row.modulo_ur;

        if (Object.keys(updates).length > 0) {
          await prisma.ingresos.update({
            where: { identificadorUnico: uniqueIdentifier },
            data: updates,
          });
        }
      } else {
        // Crear nuevo registro
        await prisma.ingresos.create({
          data: {
            identificadorUnico: uniqueIdentifier,
            lpu: row.lpu,
            apellido: row.apellido,
            nombres: row.nombres,
            fechaHoraIng: fechaHoraIng,
            establecimiento: row.establecimiento,
            modulo_ur: row.modulo_ur,
            pabellon: row.pabellon,
            celda: row.celda,
          },
        });
      }
    } catch (error) {}
  }

  // Guardar cambios en el archivo JSON
  writeJsonFile(jsonFilePath, jsonData);
}

main()
  .catch((e) => {
    console.error('Error en el script import-excel2:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
