//backend\src\scripts\getPrevencion.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPrevencion() {
  try {
    const prevencion = await prisma.prevenciones.findUnique({
      where: {
        id: 8, // ID específico
      },
    });
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

getPrevencion();
/*
Jonathan@DESKTOP-5AE31R4 MINGW64 ~/Desktop/nest/next-nest-project/backend (home61)
$ npx ts-node src/scripts/getPrevencion.ts
Registro obtenido: {
  id: 8,
  createdAt: 2025-01-16T19:35:20.506Z,
  updatedAt: 2025-01-16T19:35:20.506Z,
  clas_seg: 'MEDIA',
  fechaHora: 2025-01-18T03:00:00.000Z,
  reyerta: 'Si',
  interv_requisa: 'Si',
  foco_igneo: 'Si',
  personalinvolucrado: '[{"grado":"Adjutor Ppal.","nombreApellidoAgente":"Julio CESPEDES ","credencial":"123456","gravedad":"Gravisima","atencionART":"","detalle":"asd"}]',
  internosinvolucrado: '[{"nombreApellido":"GOMEZ,  DIEGO MARIANO","alias":"","lpu":"437969","lpuProv":"PROV-282785","sitProc":"PROCESADO","gravedad":"Indefinida","atencionExtramuro":"No","detalle":"asd"}]',
  observacion: '',
  expediente: '',
  email: 'jonasans2@live.com.ar',
  establecimiento: 'C.P.F. II',
  modulo_ur: 'U.R. III',
  pabellon: '5',
  sector: 'Educación, Cocina',
  juzgados: '["DE GARANTIAS N° 4 DE LA PLATA  - BS.AS. - PROVINCIAL - Buenos Aires - Juzgado Garantia","DE GARANTIAS N° 4 DE LA PLATA  - BS.AS. - PROVINCIAL - Buenos Aires - Juzgado Garantia"]',
  imagenes: null,
  imagen: 'files-1737056120489-979867293.png',
  imagenDer: null,
  imagenIz: null,
  imagenDact: null,
  imagenSen1: null,
  imagenSen2: null,
  imagenSen3: null,
  imagenSen4: null,
  imagenSen5: null,
  imagenSen6: null,
  pdf1: null,
  pdf2: null,
  pdf3: null,
  pdf4: null,
  pdf5: null,
  pdf6: null,
  pdf7: null,
  pdf8: null,
  pdf9: null,
  pdf10: null,
  word1: null
}

Jonathan@DESKTOP-5AE31R4 MINGW64 ~/Desktop/nest/next-nest-project/backend (home61)
$*/
