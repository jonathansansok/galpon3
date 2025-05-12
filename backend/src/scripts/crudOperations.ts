//npx ts-node src/scripts/crudOperations.ts
/* import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crudOperations() {
  try {
    // **1. Operaciones con Ingresos**
    console.log('--- Operaciones con Ingresos ---');

    // Crear un ingreso
    const nuevoIngreso = await prisma.ingresos.create({
      data: {
        email: 'canaletabeto@gmail.com',
        cp: '1727',
        telefono: '0111569123268',
        emailCliente: 'jonasans2@live.com.ar',
        numeroCuit: '2037051',
        dias: '23',
        iva: 'Consumidor Final',
        apellido: 'Sansó',
        nombres: 'Jonathan',
        numeroDni: '23432432',
        provincia: 'Avellaneda',
        domicilios: 'arias 456',
        esAlerta: 'No',
        resumen: 'refe',
        observacion: 'obser',
      },
    });
    console.log('Ingreso creado:', nuevoIngreso);

    // Actualizar el ingreso
    const ingresoActualizado = await prisma.ingresos.update({
      where: { id: nuevoIngreso.id },
      data: {
        observacion: 'Observación actualizada',
      },
    });
    console.log('Ingreso actualizado:', ingresoActualizado);

    // Obtener el ingreso
    const ingresoObtenido = await prisma.ingresos.findUnique({
      where: { id: nuevoIngreso.id },
    });
    console.log('Ingreso obtenido:', ingresoObtenido);

    // **2. Operaciones con Temas**
    console.log('--- Operaciones con Temas ---');

    // Crear un tema
    const nuevoTema = await prisma.temas.create({
      data: {
        fechaHora: new Date(),
        observacion: 'Móvil asociado al cliente',
        email: 'canaletabeto@gmail.com',
        patente: 'ABC123',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        color: 'Blanco',
        tipoPintura: 'Metalizada',
        paisOrigen: 'Japón',
        tipoVehic: 'Sedán',
        motor: '1.8L',
        chasis: 'CHS123456789',
        combustion: 'Nafta',
        vin: 'VIN123456789',
        clienteId: nuevoIngreso.id, // Asociar al cliente creado anteriormente
      },
    });
    console.log('Tema creado:', nuevoTema);

    // Actualizar el tema
    const temaActualizado = await prisma.temas.update({
      where: { id: nuevoTema.id },
      data: {
        color: 'Negro',
        tipoPintura: 'Mate',
      },
    });
    console.log('Tema actualizado:', temaActualizado);

    // Obtener el tema
    const temaObtenido = await prisma.temas.findUnique({
      where: { id: nuevoTema.id },
    });
    console.log('Tema obtenido:', temaObtenido);

    // **3. Operaciones con Presupuestos**
    console.log('--- Operaciones con Presupuestos ---');

    // Crear un presupuesto
    const nuevoPresupuesto = await prisma.presupuestos.create({
      data: {
        movilId: nuevoTema.id, // Asociar al tema creado anteriormente
        clienteId: nuevoIngreso.id, // Asociar al cliente creado anteriormente
        datosMovil: {
          patente: 'ABC123',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: '2020',
          color: 'Blanco',
          tipoPintura: 'Metalizada',
          paisOrigen: 'Japón',
          tipoVehic: 'Sedán',
          motor: '1.8L',
          chasis: 'CHS123456789',
          combustion: 'Nafta',
          vin: 'VIN123456789',
        },
        datosCliente: {
          numeroCuit: '2037051',
          apellido: 'Sansó',
          nombres: 'Jonathan',
          numeroDni: '23432432',
          telefono: '0111569123268',
          emailCliente: 'jonasans2@live.com.ar',
          provincia: 'Avellaneda',
          domicilios: 'arias 456',
        },
        monto: 25000.75,
        estado: 'Pendiente',
        observaciones: 'Presupuesto inicial',
      },
    });
    console.log('Presupuesto creado:', nuevoPresupuesto);

    // Actualizar el presupuesto
    const presupuestoActualizado = await prisma.presupuestos.update({
      where: { id: nuevoPresupuesto.id },
      data: {
        monto: 30000,
        estado: 'Aprobado',
        observaciones: 'Presupuesto actualizado',
      },
    });
    console.log('Presupuesto actualizado:', presupuestoActualizado);

    // Obtener el presupuesto
    const presupuestoObtenido = await prisma.presupuestos.findUnique({
      where: { id: nuevoPresupuesto.id },
    });
    console.log('Presupuesto obtenido:', presupuestoObtenido);

    // **4. Eliminaciones (al final)**
    console.log('--- Eliminaciones ---');

    // Eliminar el presupuesto
    const presupuestoEliminado = await prisma.presupuestos.delete({
      where: { id: nuevoPresupuesto.id },
    });
    console.log('Presupuesto eliminado:', presupuestoEliminado);

    // Eliminar el tema
    const temaEliminado = await prisma.temas.delete({
      where: { id: nuevoTema.id },
    });
    console.log('Tema eliminado:', temaEliminado);

    // Eliminar el ingreso
    const ingresoEliminado = await prisma.ingresos.delete({
      where: { id: nuevoIngreso.id },
    });
    console.log('Ingreso eliminado:', ingresoEliminado);
  } catch (error) {
    console.error('Error en las operaciones CRUD:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
crudOperations();
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crudOperations() {
  try {
    // **1. Operaciones con Ingresos**
    console.log('--- Operaciones con Ingresos ---');

    // Crear un ingreso
    const nuevoIngreso = await prisma.ingresos.create({
      data: {
        email: 'canaletabeto@gmail.com',
        cp: '1727',
        telefono: '0111569123268',
        emailCliente: 'jonasans2@live.com.ar',
        numeroCuit: '2037051',
        dias: '23',
        iva: 'Consumidor Final',
        apellido: 'Sansó',
        nombres: 'Jonathan',
        numeroDni: '23432432',
        provincia: 'Avellaneda',
        domicilios: 'arias 456',
        esAlerta: 'No',
        resumen: 'refe',
        observacion: 'obser',
      },
    });
    console.log('Ingreso creado:', nuevoIngreso);

    // **2. Operaciones con Temas**
    console.log('--- Operaciones con Temas ---');

    // Crear un tema asociado al ingreso
    const nuevoTema = await prisma.temas.create({
      data: {
        fechaHora: new Date(),
        observacion: 'Móvil asociado al cliente',
        email: 'canaletabeto@gmail.com',
        patente: 'ABC123',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        color: 'Blanco',
        tipoPintura: 'Metalizada',
        paisOrigen: 'Japón',
        tipoVehic: 'Sedán',
        motor: '1.8L',
        chasis: 'CHS123456789',
        combustion: 'Nafta',
        vin: 'VIN123456789',
        clienteId: nuevoIngreso.id, // Asociar al cliente creado anteriormente
      },
    });
    console.log('Tema creado:', nuevoTema);

    // **3. Operaciones con Presupuestos**
    console.log('--- Operaciones con Presupuestos ---');

    // Crear un presupuesto asociado al tema y al ingreso
    const nuevoPresupuesto = await prisma.presupuestos.create({
      data: {
        movilId: nuevoTema.id, // Asociar al tema creado anteriormente
        clienteId: nuevoIngreso.id, // Asociar al cliente creado anteriormente
        datosMovil: {
          patente: 'ABC123',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: '2020',
          color: 'Blanco',
          tipoPintura: 'Metalizada',
          paisOrigen: 'Japón',
          tipoVehic: 'Sedán',
          motor: '1.8L',
          chasis: 'CHS123456789',
          combustion: 'Nafta',
          vin: 'VIN123456789',
        },
        datosCliente: {
          numeroCuit: '2037051',
          apellido: 'Sansó',
          nombres: 'Jonathan',
          numeroDni: '23432432',
          telefono: '0111569123268',
          emailCliente: 'jonasans2@live.com.ar',
          provincia: 'Avellaneda',
          domicilios: 'arias 456',
        },
        monto: 25000.75,
        estado: 'Pendiente',
        observaciones: 'Presupuesto inicial',
      },
    });
    console.log('Presupuesto creado:', nuevoPresupuesto);

    // Actualizar el presupuesto
    const presupuestoActualizado = await prisma.presupuestos.update({
      where: { id: nuevoPresupuesto.id },
      data: {
        monto: 30000,
        estado: 'Aprobado',
        observaciones: 'Presupuesto actualizado',
      },
    });
    console.log('Presupuesto actualizado:', presupuestoActualizado);

    // Obtener el presupuesto
    const presupuestoObtenido = await prisma.presupuestos.findUnique({
      where: { id: nuevoPresupuesto.id },
    });
    console.log('Presupuesto obtenido:', presupuestoObtenido);

    // **4. Eliminaciones (al final)**
    console.log('--- Eliminaciones ---');

    // Eliminar el presupuesto
    const presupuestoEliminado = await prisma.presupuestos.delete({
      where: { id: nuevoPresupuesto.id },
    });
    console.log('Presupuesto eliminado:', presupuestoEliminado);

    // Eliminar el tema
    const temaEliminado = await prisma.temas.delete({
      where: { id: nuevoTema.id },
    });
    console.log('Tema eliminado:', temaEliminado);

    // Eliminar el ingreso
    const ingresoEliminado = await prisma.ingresos.delete({
      where: { id: nuevoIngreso.id },
    });
    console.log('Ingreso eliminado:', ingresoEliminado);
  } catch (error) {
    console.error('Error en las operaciones CRUD:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
crudOperations();
