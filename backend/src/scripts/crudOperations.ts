//backend\src\scripts\crudOperations.ts
// npx ts-node src/scripts/crudOperations.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Creando clientes, móviles y presupuestos ---');

    // Crear múltiples clientes
    const clientes = await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        prisma.ingresos.create({
          data: {
            email: `cliente${i + 1}@example.com`,
            cp: `100${i}`,
            telefono: `0111234567${i}`,
            emailCliente: `cliente${i + 1}@example.com`,
            numeroCuit: `203705${i + 1}`,
            dias: `${i + 1}`,
            iva: 'Consumidor Final',
            apellido: `Apellido${i + 1}`,
            nombres: `Nombre${i + 1}`,
            numeroDni: `1234567${i}`,
            provincia: `Provincia${i + 1}`,
            domicilios: `Calle Falsa ${i + 1}`,
            esAlerta: 'No',
            resumen: `Resumen del cliente ${i + 1}`,
            observacion: `Observación del cliente ${i + 1}`,
          },
        }),
      ),
    );
    console.log('Clientes creados:', clientes);

    // Crear múltiples móviles asociados a los clientes
    const moviles = await Promise.all(
      clientes.map((cliente, i) =>
        prisma.temas.create({
          data: {
            fechaHora: new Date(),
            observacion: `Móvil asociado al cliente ${cliente.id}`,
            email: cliente.email,
            patente: `ABC12${i}`,
            marca: `Marca${i + 1}`,
            modelo: `Modelo${i + 1}`,
            anio: `202${i}`,
            color: `Color${i + 1}`,
            tipoPintura: `Tipo Pintura ${i + 1}`,
            paisOrigen: `País ${i + 1}`,
            tipoVehic: `Tipo Vehículo ${i + 1}`,
            motor: `Motor ${i + 1}`,
            chasis: `CHS12345678${i}`,
            combustion: `Combustión ${i + 1}`,
            vin: `VIN12345678${i}`,
            clienteId: cliente.id, // Asociar al cliente creado anteriormente
          },
        }),
      ),
    );
    console.log('Móviles creados:', moviles);

    // Crear múltiples presupuestos asociados a los móviles
    // Crear múltiples presupuestos asociados a los móviles
    const presupuestos = await Promise.all(
      moviles.map((movil, i) =>
        prisma.presupuestos.create({
          data: {
            movilId: movil.id.toString(), // Convertir a cadena
            monto: (10000 + i * 5000).toString(), // Convertir a cadena
            estado: 'Pendiente',
            observaciones: `Presupuesto inicial para móvil ${movil.id}`,
          },
        }),
      ),
    );
    console.log('Presupuestos creados:', presupuestos);

    console.log('--- Operaciones completadas exitosamente ---');
  } catch (error) {
    console.error('Error en las operaciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
main();
