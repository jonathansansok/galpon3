import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createIngreso() {
  try {
    // Datos para crear un ingreso
    const ingresoData = {
      numeroCuit: '12345678901',
      dias: '30',
      apellido: 'Perez',
      nombres: 'Juan',
      numeroDni: '12345678',
      telefono: '01112345678',
      emailCliente: 'cliente@example.com',
      provincia: 'Buenos Aires',
      iva: 'Responsable Inscripto',
      condicion: 'Cliente',
      observacion: 'Cliente con historial positivo',
      pyme: 'true',
      porcB: '15',
      porcRetIB: '5',
      cp: '1001',
      unidadDeIngreso: 'Unidad 1',
      fechaHoraIng: new Date('2023-10-01T12:00:00.000Z'),
      alias: 'JP',
      tipoDoc: 'DNI',
      nacionalidad: 'Argentina',
      domicilios: 'Calle Falsa 123, Buenos Aires',
      numeroCausa: '456789',
      procedencia: 'Capital Federal',
      orgCrim: 'Ninguna',
      cualorg: '',
      profesion: 'Ingeniero',
      esAlerta: 'No',
      reingreso: 'No',
      establecimiento: 'Establecimiento 1',
      modulo_ur: 'Módulo A',
      pabellon: 'Pabellón 3',
      celda: 'Celda 12',
      titInfoPublic: 'Información adicional',
      resumen: 'Resumen del ingreso',
      link: 'http://example.com',
      ubicacionMap: 'Ubicación en el mapa',
      lpu: '12345',
      sitProc: 'Activo',
      lpuProv: 'Provincia 1',
      subGrupo: 'Grupo A',
      sexo: 'Masculino',
      sexualidad: 'Heterosexual',
      estadoCivil: 'Soltero',
      internosinvolucrado: '[]',
    };

    // Crear el ingreso en la base de datos
    const newIngreso = await prisma.ingresos.create({
      data: ingresoData,
    });

    console.log('Ingreso creado exitosamente:', newIngreso);
  } catch (error) {
    console.error('Error al crear ingreso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
createIngreso();
