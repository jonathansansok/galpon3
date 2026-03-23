import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Admin ───────────────────────────────────────────────────────────────────

async function seedAdminUser() {
  const email = 'admin@galpon3.com';
  const hashedPassword = await bcrypt.hash('Admin1234!', 10);
  const existing = await prisma.users.findFirst({ where: { email } });
  if (existing) {
    await prisma.users.update({
      where: { id: existing.id },
      data: { password: hashedPassword, status: 'ACTIVO', privilege: 'A1' },
    });
    console.log(`  [SKIP] Admin ya existe, contraseña actualizada`);
  } else {
    await prisma.users.create({
      data: { email, password: hashedPassword, nombre: 'Admin', apellido: 'Galpon', status: 'ACTIVO', privilege: 'A1' },
    });
    console.log(`  [OK]   Admin creado: ${email}`);
  }
  console.log('  Credenciales: admin@galpon3.com / Admin1234!');
}

// ─── Clientes ─────────────────────────────────────────────────────────────────

const CLIENTES = [
  { apellido: 'González',  nombres: 'María Elena',       numeroDni: '27341890', numeroCuit: '27273418905', telefono: '1145678901', emailCliente: 'mgonzalez@gmail.com',       dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino' },
  { apellido: 'Rodríguez', nombres: 'Carlos Alberto',    numeroDni: '33572014', numeroCuit: '20335720142', telefono: '1156789012', emailCliente: 'crodriguez@hotmail.com',     dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino' },
  { apellido: 'Fernández', nombres: 'Ana Laura',         numeroDni: '28904567', numeroCuit: '27289045671', telefono: '2215678901', emailCliente: 'afernandez@yahoo.com.ar',    dias: '15', provincia: 'Buenos Aires', sexo: 'Femenino' },
  { apellido: 'López',     nombres: 'Martín Sebastián',  numeroDni: '35126789', numeroCuit: '20351267893', telefono: '2614567890', emailCliente: 'mlopez@gmail.com',            dias: '30', provincia: 'Mendoza',      sexo: 'Masculino' },
  { apellido: 'Martínez',  nombres: 'Claudia Beatriz',   numeroDni: '24678901', numeroCuit: '27246789017', telefono: '3515678901', emailCliente: 'cmartinez@gmail.com',         dias: '30', provincia: 'Córdoba',      sexo: 'Femenino' },
  { apellido: 'Pérez',     nombres: 'Ricardo Fabián',    numeroDni: '30456123', numeroCuit: '20304561234', telefono: '3415678901', emailCliente: 'rperez@outlook.com',          dias: '30', provincia: 'Santa Fe',     sexo: 'Masculino' },
];

async function seedClientes() {
  console.log('\n--- Clientes ---');
  const map: Record<string, { id: number; uuid: string }> = {};
  for (const c of CLIENTES) {
    const existing = await prisma.ingresos.findFirst({ where: { numeroDni: c.numeroDni } });
    if (existing) {
      console.log(`  [SKIP] ${c.apellido}, ${c.nombres}`);
      map[c.numeroDni] = { id: existing.id, uuid: existing.uuid };
    } else {
      const n = await prisma.ingresos.create({ data: c });
      console.log(`  [OK]   ${c.apellido}, ${c.nombres} → id=${n.id}`);
      map[c.numeroDni] = { id: n.id, uuid: n.uuid };
    }
  }
  return map;
}

// ─── Móviles ──────────────────────────────────────────────────────────────────

const MOVILES = [
  // González: 3 vehículos
  { dniCliente: '27341890', patente: 'AA123BB', marca: 'Toyota',     modelo: 'Corolla', anio: '2019', color: 'Plateado', combustion: 'Nafta', tipoVehic: 'Sedán' },
  { dniCliente: '27341890', patente: 'GH890IJ', marca: 'Toyota',     modelo: 'Hilux',   anio: '2021', color: 'Blanco',   combustion: 'Diesel', tipoVehic: 'Pick-up' },
  { dniCliente: '27341890', patente: 'XY001ZA', marca: 'Renault',    modelo: 'Kangoo',  anio: '2015', color: 'Gris',     combustion: 'GNC',   tipoVehic: 'Furgoneta' },
  // Rodríguez: 2 vehículos
  { dniCliente: '33572014', patente: 'BC456DE', marca: 'Ford',       modelo: 'Focus',   anio: '2020', color: 'Rojo',     combustion: 'Nafta', tipoVehic: 'Hatchback' },
  { dniCliente: '33572014', patente: 'HI234JK', marca: 'Ford',       modelo: 'Fiesta',  anio: '2016', color: 'Azul',     combustion: 'Nafta', tipoVehic: 'Hatchback' },
  // Fernández: 2 vehículos
  { dniCliente: '28904567', patente: 'CD789FG', marca: 'Volkswagen', modelo: 'Gol',     anio: '2017', color: 'Gris',     combustion: 'Nafta', tipoVehic: 'Hatchback' },
  { dniCliente: '28904567', patente: 'JK567LM', marca: 'Volkswagen', modelo: 'Polo',    anio: '2023', color: 'Blanco',   combustion: 'Nafta', tipoVehic: 'Hatchback' },
  // López: 3 vehículos
  { dniCliente: '35126789', patente: 'DE012HI', marca: 'Renault',    modelo: 'Sandero', anio: '2021', color: 'Azul',     combustion: 'GNC',   tipoVehic: 'Hatchback' },
  { dniCliente: '35126789', patente: 'LM890NO', marca: 'Renault',    modelo: 'Duster',  anio: '2020', color: 'Negro',    combustion: 'Nafta', tipoVehic: 'SUV' },
  { dniCliente: '35126789', patente: 'NO123PQ', marca: 'Renault',    modelo: 'Kangoo',  anio: '2018', color: 'Blanco',   combustion: 'GNC',   tipoVehic: 'Furgoneta' },
  // Martínez: 2 vehículos
  { dniCliente: '24678901', patente: 'EF345JK', marca: 'Fiat',       modelo: 'Cronos',  anio: '2022', color: 'Negro',    combustion: 'Nafta', tipoVehic: 'Sedán' },
  { dniCliente: '24678901', patente: 'PQ456RS', marca: 'Fiat',       modelo: 'Uno',     anio: '2014', color: 'Rojo',     combustion: 'Nafta', tipoVehic: 'Hatchback' },
  // Pérez: 2 vehículos
  { dniCliente: '30456123', patente: 'FG678LM', marca: 'Chevrolet',  modelo: 'Onix',    anio: '2018', color: 'Blanco',   combustion: 'Nafta', tipoVehic: 'Hatchback' },
  { dniCliente: '30456123', patente: 'RS789TU', marca: 'Chevrolet',  modelo: 'Spin',    anio: '2020', color: 'Gris',     combustion: 'Nafta', tipoVehic: 'Monovolumen' },
];

async function seedMoviles(clienteMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Móviles ---');
  const map: Record<string, { id: number; uuid: string }> = {};
  for (const m of MOVILES) {
    const cliente = clienteMap[m.dniCliente];
    if (!cliente) { console.log(`  [WARN] Sin cliente DNI ${m.dniCliente}`); continue; }
    const existing = await prisma.temas.findFirst({ where: { patente: m.patente } });
    if (existing) {
      console.log(`  [SKIP] ${m.patente} (${m.marca} ${m.modelo})`);
      map[m.patente] = { id: existing.id, uuid: existing.uuid };
    } else {
      const { dniCliente, ...data } = m;
      const n = await prisma.temas.create({ data: { ...data, clienteId: cliente.id } });
      console.log(`  [OK]   ${m.patente} ${m.marca} ${m.modelo} → id=${n.id}, clienteId=${cliente.id}`);
      map[m.patente] = { id: n.id, uuid: n.uuid };
    }
  }
  return map;
}

// ─── Presupuestos ─────────────────────────────────────────────────────────────
// IMPORTANTE: movilId = String(temas.id)  ← JOIN ON p.movilId = t.id

const PRESUPUESTOS = [
  // González — Corolla (2 presupuestos)
  { key: 'COROLLA-1', patente: 'AA123BB', monto: '45000',  estado: 'Finalizado', tipoTrabajo: 'Pintura parcial',           observaciones: 'Retoque capot y aletas delanteras. Trabajo finalizado. [SEED]' },
  { key: 'COROLLA-2', patente: 'AA123BB', monto: '85000',  estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',           observaciones: 'Paragolpes trasero + pintura completa. [SEED]' },
  // González — Hilux
  { key: 'HILUX-1',   patente: 'GH890IJ', monto: '130000', estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',           observaciones: 'Lateral derecho completo, abolladuras múltiples. [SEED]' },
  // González — Kangoo
  { key: 'KANGOO1-1', patente: 'XY001ZA', monto: '28000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',           observaciones: 'Retoque puerta corrediza. Presupuesto pendiente aprobación. [SEED]' },
  // Rodríguez — Focus (2 presupuestos)
  { key: 'FOCUS-1',   patente: 'BC456DE', monto: '38000',  estado: 'Finalizado', tipoTrabajo: 'Chapa',                     observaciones: 'Reparación guardabarros trasero derecho. Finalizado. [SEED]' },
  { key: 'FOCUS-2',   patente: 'BC456DE', monto: '42000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',           observaciones: 'Retoque capot y techo. Esperando confirmación. [SEED]' },
  // Rodríguez — Fiesta
  { key: 'FIESTA-1',  patente: 'HI234JK', monto: '22000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura completa',          observaciones: 'Cambio de color completo de azul a negro. [SEED]' },
  // Fernández — Gol (2 presupuestos)
  { key: 'GOL-1',     patente: 'CD789FG', monto: '58000',  estado: 'Finalizado', tipoTrabajo: 'Chapa y mecánica',          observaciones: 'Daño frontal leve, alineación y pintura. Finalizado. [SEED]' },
  { key: 'GOL-2',     patente: 'CD789FG', monto: '120000', estado: 'Aprobado',   tipoTrabajo: 'Chapa, pintura y mecánica', observaciones: 'Lateral izquierdo, alineación y pintura total. [SEED]' },
  // Fernández — Polo
  { key: 'POLO-1',    patente: 'JK567LM', monto: '15000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',           observaciones: 'Rayón en puerta trasera. Presupuesto inicial. [SEED]' },
  // López — Sandero (2 presupuestos)
  { key: 'SANDERO-1', patente: 'DE012HI', monto: '31000',  estado: 'Finalizado', tipoTrabajo: 'Pintura parcial',           observaciones: 'Retoque aletas y capot. Finalizado conforme. [SEED]' },
  { key: 'SANDERO-2', patente: 'DE012HI', monto: '35000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura completa',          observaciones: 'Cambio de color completo a gris perla. [SEED]' },
  // López — Duster
  { key: 'DUSTER-1',  patente: 'LM890NO', monto: '75000',  estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',           observaciones: 'Daño lateral en accidente leve. Aprobado por seguro. [SEED]' },
  // López — Kangoo2
  { key: 'KANGOO2-1', patente: 'NO123PQ', monto: '19000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',           observaciones: 'Óxido en zócalos. En evaluación. [SEED]' },
  // Martínez — Cronos
  { key: 'CRONOS-1',  patente: 'EF345JK', monto: '67000',  estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',           observaciones: 'Abolladuras múltiples puerta trasera derecha. [SEED]' },
  // Martínez — Uno
  { key: 'UNO-1',     patente: 'PQ456RS', monto: '12000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',           observaciones: 'Desgaste de pintura general. Presupuesto básico. [SEED]' },
  // Pérez — Onix (2 presupuestos)
  { key: 'ONIX-1',    patente: 'FG678LM', monto: '27000',  estado: 'Finalizado', tipoTrabajo: 'Chapa',                     observaciones: 'Reparación paragolpes delantero. Finalizado. [SEED]' },
  { key: 'ONIX-2',    patente: 'FG678LM', monto: '54000',  estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',           observaciones: 'Lateral izquierdo + pintura parcial. [SEED]' },
  // Pérez — Spin
  { key: 'SPIN-1',    patente: 'RS789TU', monto: '33000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura completa',          observaciones: 'Cambio de color. Pendiente aprobación cliente. [SEED]' },
];

async function seedPresupuestos(movilMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Presupuestos ---');
  // Limpiar seed previo
  const deleted = await prisma.presupuestos.deleteMany({ where: { observaciones: { contains: '[SEED]' } } });
  if (deleted.count > 0) console.log(`  [DEL]  ${deleted.count} presupuestos previos eliminados`);

  const map: Record<string, { id: number; uuid: string }> = {};
  for (const p of PRESUPUESTOS) {
    const movil = movilMap[p.patente];
    if (!movil) { console.log(`  [WARN] Sin móvil ${p.patente}`); continue; }
    const { key, ...data } = p;
    // FIX CRÍTICO: movilId = String(movil.id) — el JOIN es ON p.movilId = t.id
    const n = await prisma.presupuestos.create({ data: { ...data, movilId: String(movil.id) } });
    console.log(`  [OK]   ${p.key} — ${p.patente} $${p.monto} (${p.estado}) → id=${n.id}`);
    map[key] = { id: n.id, uuid: n.uuid };
  }
  return map;
}

// ─── Turnos ───────────────────────────────────────────────────────────────────
// presupuestoId = presupuesto.uuid  ← JOIN ON t.presupuestoId = p.uuid

const TURNOS = [
  // Finalizados (histórico)
  { key: 'T-COROLLA-1',  presKey: 'COROLLA-1', plaza: 1, ini: '2026-01-15T08:00', fin: '2026-01-18T17:00', iniReal: '2026-01-15T08:30', finReal: '2026-01-18T16:45', estado: 'Finalizado', obs: 'Trabajo completado. Cliente conforme. [SEED]' },
  { key: 'T-FOCUS-1',    presKey: 'FOCUS-1',   plaza: 2, ini: '2026-02-03T08:00', fin: '2026-02-05T18:00', iniReal: '2026-02-03T09:00', finReal: '2026-02-05T17:30', estado: 'Finalizado', obs: 'Guardabarros reparado y pintado. [SEED]' },
  { key: 'T-GOL-1',      presKey: 'GOL-1',     plaza: 3, ini: '2026-02-17T08:00', fin: '2026-02-21T18:00', iniReal: '2026-02-17T08:00', finReal: '2026-02-21T17:00', estado: 'Finalizado', obs: 'Reparación frontal y alineación. Finalizado. [SEED]' },
  { key: 'T-SANDERO-1',  presKey: 'SANDERO-1', plaza: 4, ini: '2026-02-24T09:00', fin: '2026-02-26T18:00', iniReal: '2026-02-24T09:00', finReal: '2026-02-26T16:00', estado: 'Finalizado', obs: 'Pintura parcial finalizada sin inconvenientes. [SEED]' },
  { key: 'T-ONIX-1',     presKey: 'ONIX-1',    plaza: 5, ini: '2026-03-03T08:00', fin: '2026-03-04T18:00', iniReal: '2026-03-03T08:30', finReal: '2026-03-04T17:00', estado: 'Finalizado', obs: 'Paragolpes reparado. Entrega OK. [SEED]' },
  // En curso
  { key: 'T-COROLLA-2',  presKey: 'COROLLA-2', plaza: 1, ini: '2026-03-10T08:00', fin: '2026-03-14T18:00', iniReal: '2026-03-10T08:30', finReal: null, estado: 'En curso', obs: 'En proceso de masillado y lijado. [SEED]' },
  { key: 'T-GOL-2',      presKey: 'GOL-2',     plaza: 2, ini: '2026-03-18T08:00', fin: '2026-03-25T18:00', iniReal: '2026-03-18T09:00', finReal: null, estado: 'En curso', obs: 'Lateral en proceso, pintura base aplicada. [SEED]' },
  { key: 'T-HILUX-1',    presKey: 'HILUX-1',   plaza: 6, ini: '2026-03-20T08:00', fin: '2026-03-28T18:00', iniReal: '2026-03-20T08:00', finReal: null, estado: 'En curso', obs: 'Chapa lateral en proceso, complejidad alta. [SEED]' },
  // Programados (futuros)
  { key: 'T-SANDERO-2',  presKey: 'SANDERO-2', plaza: 3, ini: '2026-04-02T09:00', fin: '2026-04-05T18:00', iniReal: null, finReal: null, estado: 'Programado', obs: 'Confirmar con cliente 48hs antes. [SEED]' },
  { key: 'T-DUSTER-1',   presKey: 'DUSTER-1',  plaza: 4, ini: '2026-04-07T08:00', fin: '2026-04-11T18:00', iniReal: null, finReal: null, estado: 'Programado', obs: 'Seguro ya aprobado. Cita confirmada. [SEED]' },
  { key: 'T-CRONOS-1',   presKey: 'CRONOS-1',  plaza: 5, ini: '2026-04-14T08:00', fin: '2026-04-17T18:00', iniReal: null, finReal: null, estado: 'Programado', obs: 'Cliente confirmó por WhatsApp. [SEED]' },
  { key: 'T-ONIX-2',     presKey: 'ONIX-2',    plaza: 7, ini: '2026-04-22T08:00', fin: '2026-04-25T18:00', iniReal: null, finReal: null, estado: 'Programado', obs: 'Turno coordinado con seguro Mapfre. [SEED]' },
];

async function seedTurnos(presupuestoMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Turnos ---');
  const deleted = await prisma.turnos.deleteMany({ where: { observaciones: { contains: '[SEED]' } } });
  if (deleted.count > 0) console.log(`  [DEL]  ${deleted.count} turnos previos eliminados`);

  const map: Record<string, { id: number; uuid: string }> = {};
  for (const t of TURNOS) {
    const pres = presupuestoMap[t.presKey];
    if (!pres) { console.log(`  [WARN] Sin presupuesto key=${t.presKey}`); continue; }
    const n = await prisma.turnos.create({
      data: {
        presupuestoId: pres.uuid,
        plaza: t.plaza,
        fechaHoraInicioEstimada: new Date(t.ini),
        fechaHoraFinEstimada: new Date(t.fin),
        fechaHoraInicioReal: t.iniReal ? new Date(t.iniReal) : null,
        fechaHoraFinReal: t.finReal ? new Date(t.finReal) : null,
        estado: t.estado,
        observaciones: t.obs,
      },
    });
    console.log(`  [OK]   ${t.key} — Plaza ${t.plaza} (${t.estado}) → id=${n.id}`);
    map[t.key] = { id: n.id, uuid: n.uuid };
  }
  return map;
}

// ─── Trabajos Realizados ──────────────────────────────────────────────────────

const TRABAJOS = [
  {
    turnoKey: 'T-COROLLA-1',
    fechaRealiz: new Date('2026-01-18T16:45:00'),
    descripcion: 'Retoque de pintura en capot y aletas delanteras. Lijado, imprimación y laca bicapa color plateado metalizado. Control de calidad aprobado.',
    monto: '45000',
    observaciones: 'Cliente retiró el vehículo conforme. Sin observaciones. [SEED]',
  },
  {
    turnoKey: 'T-FOCUS-1',
    fechaRealiz: new Date('2026-02-05T17:30:00'),
    descripcion: 'Reparación de guardabarros trasero derecho: enderezado de chapa, masillado, lijado fino y pintura base + laca. Color rojo original restaurado.',
    monto: '38000',
    observaciones: 'Trabajo aceptado por el cliente. Entrega sin inconvenientes. [SEED]',
  },
  {
    turnoKey: 'T-GOL-1',
    fechaRealiz: new Date('2026-02-21T17:00:00'),
    descripcion: 'Reparación daño frontal: paragolpes, capot y alineación de dirección. Pintura de zona frontal con imprimación epóxica y laca. Alineación y balanceo incluidos.',
    monto: '58000',
    observaciones: 'Seguro La Caja cubrió el 80%. Diferencia abonada por el cliente. [SEED]',
  },
  {
    turnoKey: 'T-SANDERO-1',
    fechaRealiz: new Date('2026-02-26T16:00:00'),
    descripcion: 'Pintura parcial: capot, aletas delanteras y techo. Preparación de superficie, base de color gris perla y laca final. Sellado de bordes.',
    monto: '31000',
    observaciones: 'Cliente muy conforme. Recomendó el taller a un conocido. [SEED]',
  },
  {
    turnoKey: 'T-ONIX-1',
    fechaRealiz: new Date('2026-03-04T17:00:00'),
    descripcion: 'Reparación de paragolpes delantero: desmontaje, enderezado de soporte, masillado y pintura. Reemplazo de clip de fijación roto.',
    monto: '27000',
    observaciones: 'Trabajo sencillo, completado en tiempo. Cliente retiró al día siguiente. [SEED]',
  },
];

async function seedTrabajosRealizados(turnoMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Trabajos Realizados ---');
  const deleted = await prisma.trabajosRealizados.deleteMany({ where: { observaciones: { contains: '[SEED]' } } });
  if (deleted.count > 0) console.log(`  [DEL]  ${deleted.count} trabajos previos eliminados`);

  for (const tr of TRABAJOS) {
    const turno = turnoMap[tr.turnoKey];
    if (!turno) { console.log(`  [WARN] Sin turno key=${tr.turnoKey}`); continue; }
    const { turnoKey, ...data } = tr;
    const n = await prisma.trabajosRealizados.create({ data: { ...data, turnoId: turno.uuid } });
    console.log(`  [OK]   ${tr.turnoKey} → trabajoId=${n.id}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== SEED Galpón 3 Taller ===');
  await seedAdminUser();
  const clienteMap     = await seedClientes();
  const movilMap       = await seedMoviles(clienteMap);
  const presupuestoMap = await seedPresupuestos(movilMap);
  const turnoMap       = await seedTurnos(presupuestoMap);
  await seedTrabajosRealizados(turnoMap);

  console.log('\n=== RESUMEN ===');
  console.log(`  Clientes:            ${Object.keys(clienteMap).length}`);
  console.log(`  Móviles:             ${Object.keys(movilMap).length}`);
  console.log(`  Presupuestos:        ${PRESUPUESTOS.length}`);
  console.log(`  Turnos:              ${TURNOS.length} (5 finalizados, 3 en curso, 4 programados)`);
  console.log(`  Trabajos realizados: ${TRABAJOS.length}`);
  console.log('\n  Flujo de prueba completo:');
  console.log('    González → Corolla AA123BB → $85.000 Aprobado → Turno En curso (Plaza 1)');
  console.log('    González → Corolla AA123BB → $45.000 Finalizado → Turno Finalizado → Trabajo realizado');
  console.log('    López    → Sandero DE012HI → $35.000 Aprobado → Turno Programado (Abril)');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
