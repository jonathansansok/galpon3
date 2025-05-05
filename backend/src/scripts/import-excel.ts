//backend\src\scripts\import-excel.ts

/* 
npx ts-node import-excel.tsimport { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// Definir el tipo para los datos del Excel
type IngresoData = {
  establecimiento: string;
  lpu: string;
  apellido: string;
  nombres: string;
  lpuProv: string;
  sexo: string;
  perfil: string;
  sitProc: string;
  profesion: string;
  fechaNacimiento: string;
  sexualidad: string;
  fechaHoraIng: string;
  nacionalidad: string;
  tipoDoc: string;
  numeroDni: string | number; // Permitir string o number
};

// Función para convertir una fecha en formato dd/MM/yyyy a un objeto Date
function parseDate(dateString: any): Date | null {
  if (typeof dateString === 'string') {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  return null;
}

async function main() {
  const filePath = path.join(__dirname, 'data.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: IngresoData[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    await prisma.ingresos.create({
      data: {
        establecimiento: row.establecimiento,
        lpu: row.lpu,
        apellido: row.apellido,
        nombres: row.nombres,
        lpuProv: row.lpuProv,
        sexo: row.sexo,
        perfil: row.perfil,
        sitProc: row.sitProc,
        profesion: row.profesion,
        fechaNacimiento: parseDate(row.fechaNacimiento), // Convertir la fecha
        sexualidad: row.sexualidad,
        fechaHoraIng: parseDate(row.fechaHoraIng), // Convertir la fecha
        nacionalidad: row.nacionalidad,
        tipoDoc: row.tipoDoc,
        numeroDni: String(row.numeroDni), // Convertir a string
      },
    });
  }
}

main()
  .catch((e) => )
  .finally(async () => {
    await prisma.$disconnect();
  }); */
/* recorda el comando es npx ts-node import-excel.ts


recorda que primero si las fechas son 27/01/2022 tenes que pasarlas a 2022-01-27 haciendoles click derecho a todas
seleccionadas y poner fecha afrikaanaas que es la primera y poner yyyy-mm-dd
https://data.canadensys.net/tools/dates recorda usar esta web para pasar los datos, recorda que la columna final del excel tiene que ser formato general, las columnas de 
conversion tienen que ser tipo texto, el pegado a las columnas tiene que ser pegado especial texto, y 

*/
// backend/src/scripts/import-excel.ts
/* import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// Definir el tipo para los datos del Excel
type IngresoData = {
  establecimiento: string;
  lpu: string | number; // Permitir string o number
  apellido: string;
  nombres: string;
  lpuProv: string;
  sexo: string;
  perfil: string;
  sitProc: string;
  profesion: string;
  fechaNacimiento: string;
  sexualidad: string;
  fechaHoraIng: string;
  nacionalidad: string;
  tipoDoc: string;
  numeroDni: string | number; // Permitir string o number
};

// Función para convertir una fecha en formato dd/MM/yyyy a un objeto Date
function parseDate(dateString: any): Date | null {
  if (typeof dateString === 'string') {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  return null;
}

async function main() {
  const filePath = path.join(__dirname, 'data.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: IngresoData[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    await prisma.ingresos.create({
      data: {
        establecimiento: row.establecimiento,
        lpu: String(row.lpu), // Convertir a string
        apellido: row.apellido,
        nombres: row.nombres,
        lpuProv: row.lpuProv,
        sexo: row.sexo,
        perfil: row.perfil,
        sitProc: row.sitProc,
        profesion: row.profesion,
        fechaNacimiento: parseDate(row.fechaNacimiento), // Convertir la fecha
        sexualidad: row.sexualidad,
        fechaHoraIng: parseDate(row.fechaHoraIng), // Convertir la fecha
        nacionalidad: row.nacionalidad,
        tipoDoc: row.tipoDoc,
        numeroDni: String(row.numeroDni), // Convertir a string
      },
    });
  }
}

main()
  .catch((e) => )
  .finally(async () => {
    await prisma.$disconnect();
  });
 */
/* import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// Definir el tipo para los datos del Excel
type IngresoData = {
  establecimiento: string;
  lpu: string | number; // Permitir string o number
  apellido: string;
  nombres: string;
  lpuProv: string;
  sexo: string;
  perfil: string;
  sitProc: string;
  profesion: string;
  fechaNacimiento: string;
  sexualidad: string;
  fechaHoraIng: string;
  nacionalidad: string;
  tipoDoc: string;
  numeroDni: string | number; // Permitir string o number
};

async function main() {
  const filePath = path.join(__dirname, 'data2.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: IngresoData[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    await prisma.ingresos.create({
      data: {
        establecimiento: row.establecimiento,
        lpu: String(row.lpu), // Convertir a string
        apellido: row.apellido,
        nombres: row.nombres,
        lpuProv: row.lpuProv,
        sexo: row.sexo,
        perfil: row.perfil,
        sitProc: row.sitProc,
        profesion: row.profesion,
        fechaNacimiento: new Date(row.fechaNacimiento), // Convertir a Date
        sexualidad: row.sexualidad,
        fechaHoraIng: new Date(row.fechaHoraIng), // Convertir a Date
        nacionalidad: row.nacionalidad,
        tipoDoc: row.tipoDoc,
        numeroDni: String(row.numeroDni), // Convertir a string
      },
    });
  }
}

main()
  .catch((e) => )
  .finally(async () => {
    await prisma.$disconnect();
  }); */
