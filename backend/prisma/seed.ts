import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Truncate completo ───────────────────────

async function truncateAll() {
  console.log('\n=== TRUNCATE ALL ===');
  await prisma.trabajosRealizados.deleteMany({});  console.log('  [DEL] TrabajosRealizados');
  await prisma.turnos.deleteMany({});               console.log('  [DEL] Turnos');
  await prisma.presupuestos.deleteMany({});         console.log('  [DEL] Presupuestos');
  await prisma.piezas.deleteMany({});               console.log('  [DEL] Piezas');
  await prisma.temas.deleteMany({});                console.log('  [DEL] Temas (Móviles)');
  await prisma.auditLog.deleteMany({});             console.log('  [DEL] AuditLog');
  await prisma.ingresos.deleteMany({});             console.log('  [DEL] Ingresos (Clientes)');
  await prisma.modelo.deleteMany({});               console.log('  [DEL] Modelos');
  await prisma.marcas.deleteMany({});               console.log('  [DEL] Marcas');
  await prisma.partes.deleteMany({});               console.log('  [DEL] Partes');
  await prisma.users.deleteMany({});                console.log('  [DEL] Users');
}

// ─── Users ────────────────────────────────────────────────────────────────────

async function seedUsers(): Promise<Record<string, number>> {
  console.log('\n--- Users ---');
  const pass = await bcrypt.hash('Admin1234!', 10);
  const users = [
    { email: 'admin@galpon3.com',    password: pass, nombre: 'Admin',    apellido: 'Galpón',   status: 'ACTIVO', privilege: 'A1' },
    { email: 'martin@galpon3.com',   password: pass, nombre: 'Martín',   apellido: 'Suárez',   status: 'ACTIVO', privilege: 'B1' },
    { email: 'lorena@galpon3.com',   password: pass, nombre: 'Lorena',   apellido: 'Vásquez',  status: 'ACTIVO', privilege: 'B1' },
  ];
  const map: Record<string, number> = {};
  for (const u of users) {
    const created = await prisma.users.create({ data: u });
    console.log(`  [OK] ${u.email} → id=${created.id}`);
    if (u.email === 'martin@galpon3.com') map['martin'] = created.id;
    if (u.email === 'lorena@galpon3.com') map['lorena'] = created.id;
  }
  console.log('  Contraseña de todos: Admin1234!');
  return map;
}

// ─── Clientes ─────────────────────────────────────────────────────────────────

const CLIENTES = [
  { apellido: 'Biolcati',         nombres: 'Alejandro Martín',  numeroDni: '20458912', numeroCuit: '20204589124', telefono: '5491159234567', emailCliente: 'abiolcati@gmail.com',              dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Empresario',       domicilios: 'Av. del Libertador 2850, CABA' },
  { apellido: 'Urquiza',          nombres: 'Valentina Sofía',   numeroDni: '27834501', numeroCuit: '27278345018', telefono: '5491145678923', emailCliente: 'vurquiza@estudio.com.ar',          dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Abogada',          domicilios: 'Coronel Díaz 1540, Palermo, CABA' },
  { apellido: 'Rocca',            nombres: 'Federico Andrés',   numeroDni: '31245678', numeroCuit: '20312456783', telefono: '5491167894523', emailCliente: 'federico.rocca@clinicacentro.ar',  dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Médico cirujano',  domicilios: 'San Isidro, GBA Norte' },
  { apellido: 'Etchegoyen',       nombres: 'Mariana Belén',     numeroDni: '25678901', numeroCuit: '27256789015', telefono: '5491178901234', emailCliente: 'm.etchegoyen@arq.com.ar',          dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Arquitecta',       domicilios: 'Posadas 1442, Recoleta, CABA' },
  { apellido: 'Llambías',         nombres: 'Ignacio Eduardo',   numeroDni: '28901234', numeroCuit: '20289012341', telefono: '5492314567890', emailCliente: 'illambias@llambiasindustrias.com', dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Industrial',       domicilios: 'Manuel Alberti, Pilar' },
  { apellido: 'Pereyra Iraola',   nombres: 'Sofía Inés',        numeroDni: '33456789', numeroCuit: '27334567895', telefono: '5491156789034', emailCliente: 'spereyra@fondocapital.com.ar',     dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Directora financiera', domicilios: 'Maipú 1290, Vicente López' },
  { apellido: 'Blaquier',         nombres: 'Rodrigo Facundo',   numeroDni: '29012345', numeroCuit: '20290123452', telefono: '5491189012345', emailCliente: 'rblaquier@blaquierinv.com',        dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Inversor',         domicilios: 'Nordelta, Tigre' },
  { apellido: 'Aráoz',            nombres: 'Constanza Lucila',  numeroDni: '34567890', numeroCuit: '27345678903', telefono: '5491101234567', emailCliente: 'caraoz@grupoaraoz.com.ar',         dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'CEO',              domicilios: 'Olivos, Vicente López' },
  { apellido: 'Duggan',           nombres: 'Martín Tomás',      numeroDni: '26789012', numeroCuit: '20267890123', telefono: '5491112345678', emailCliente: 'martin.duggan@duggangroup.com',    dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Empresario',       domicilios: 'La Horqueta, San Isidro' },
  { apellido: 'Zubizarreta',      nombres: 'Catalina Fernanda', numeroDni: '30123456', numeroCuit: '27301234564', telefono: '5491134567890', emailCliente: 'czubizarreta@escribania.com.ar',   dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Escribana',        domicilios: 'Ocampo 525, Barrio Parque, CABA' },
];

async function seedClientes() {
  console.log('\n--- Clientes ---');
  const map: Record<string, { id: number; uuid: string }> = {};
  for (const c of CLIENTES) {
    const n = await prisma.ingresos.create({ data: c });
    console.log(`  [OK] ${c.apellido}, ${c.nombres} → id=${n.id}`);
    map[c.numeroDni] = { id: n.id, uuid: n.uuid };
  }
  return map;
}

// ─── Móviles ──────────────────────────────────────────────────────────────────

const MOVILES = [
  // Biolcati (3)
  { dniCliente: '20458912', patente: 'AB123CD', marca: 'BMW',        modelo: 'X5 xDrive40i',      anio: '2022', color: 'Negro metalizado',    combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  { dniCliente: '20458912', patente: 'EF456GH', marca: 'Mercedes',   modelo: 'Clase E 300',        anio: '2021', color: 'Gris espacial',       combustion: 'Nafta',   tipoVehic: 'Sedán premium' },
  { dniCliente: '20458912', patente: 'IJ789KL', marca: 'Porsche',    modelo: 'Macan S',            anio: '2023', color: 'Blanco platino',      combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  // Urquiza (2)
  { dniCliente: '27834501', patente: 'MN012OP', marca: 'Audi',       modelo: 'Q7 55 TFSI',         anio: '2022', color: 'Negro brillante',     combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  { dniCliente: '27834501', patente: 'QR345ST', marca: 'Volvo',      modelo: 'XC90 T8 Recharge',   anio: '2020', color: 'Plateado crepúsculo', combustion: 'Híbrido', tipoVehic: 'SUV premium' },
  // Rocca (3)
  { dniCliente: '31245678', patente: 'UV678WX', marca: 'BMW',        modelo: 'Serie 5 530i',       anio: '2021', color: 'Gris grafito',        combustion: 'Nafta',   tipoVehic: 'Sedán premium' },
  { dniCliente: '31245678', patente: 'YZ901AB', marca: 'Land Rover', modelo: 'Defender 110',       anio: '2022', color: 'Verde musgo',         combustion: 'Diesel',  tipoVehic: 'SUV off-road' },
  { dniCliente: '31245678', patente: 'CD234EF', marca: 'Audi',       modelo: 'A5 Sportback 40',    anio: '2023', color: 'Azul zafiro',         combustion: 'Nafta',   tipoVehic: 'Fastback premium' },
  // Etchegoyen (2)
  { dniCliente: '25678901', patente: 'GH567IJ', marca: 'Mercedes',   modelo: 'GLE 400 4MATIC',     anio: '2022', color: 'Beige arena dorado',  combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  { dniCliente: '25678901', patente: 'KL890MN', marca: 'Toyota',     modelo: 'Land Cruiser Prado', anio: '2021', color: 'Negro perla',         combustion: 'Diesel',  tipoVehic: 'SUV 4x4' },
  // Llambías (3)
  { dniCliente: '28901234', patente: 'OP123QR', marca: 'Lexus',      modelo: 'LX 600 Ultra Luxury',anio: '2022', color: 'Negro caviar',        combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  { dniCliente: '28901234', patente: 'ST456UV', marca: 'Ford',       modelo: 'Ranger Raptor V6',   anio: '2023', color: 'Gris eclipse',        combustion: 'Nafta',   tipoVehic: 'Pick-up premium' },
  { dniCliente: '28901234', patente: 'WX789YZ', marca: 'Volkswagen', modelo: 'Touareg V6 Elegance',anio: '2021', color: 'Plata reflex',        combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  // Pereyra Iraola (2)
  { dniCliente: '33456789', patente: 'AB012CD', marca: 'Porsche',    modelo: 'Cayenne GTS Coupé',  anio: '2023', color: 'Blanco perla',        combustion: 'Nafta',   tipoVehic: 'SUV Coupé premium' },
  { dniCliente: '33456789', patente: 'EF345GH', marca: 'BMW',        modelo: 'Serie 3 320i M Sport',anio: '2022', color: 'Negro zafiro',       combustion: 'Nafta',   tipoVehic: 'Sedán premium' },
  // Blaquier (2)
  { dniCliente: '29012345', patente: 'IJ678KL', marca: 'Audi',       modelo: 'Q8 55 TFSI Quattro', anio: '2023', color: 'Gris quantum',        combustion: 'Nafta',   tipoVehic: 'SUV Coupé premium' },
  { dniCliente: '29012345', patente: 'MN901OP', marca: 'Mercedes',   modelo: 'AMG C63 S Coupé',    anio: '2022', color: 'Negro obsidiana',     combustion: 'Nafta',   tipoVehic: 'Coupé AMG' },
  // Aráoz (2)
  { dniCliente: '34567890', patente: 'QR234ST', marca: 'Volvo',      modelo: 'XC60 T6 AWD R-Design',anio: '2022', color: 'Azul medianoche',   combustion: 'Híbrido', tipoVehic: 'SUV premium' },
  { dniCliente: '34567890', patente: 'UV567WX', marca: 'BMW',        modelo: 'X3 xDrive30i M Sport',anio: '2021', color: 'Gris mineral',       combustion: 'Nafta',   tipoVehic: 'SUV premium' },
  // Duggan (2)
  { dniCliente: '26789012', patente: 'YZ890AB', marca: 'Land Rover', modelo: 'Range Rover Sport HSE',anio: '2022', color: 'Negro Santorini',  combustion: 'Diesel',  tipoVehic: 'SUV premium' },
  { dniCliente: '26789012', patente: 'CD123EF', marca: 'Jaguar',     modelo: 'F-Pace SVR',          anio: '2021', color: 'Rojo Caldera',       combustion: 'Nafta',   tipoVehic: 'SUV deportivo' },
  // Zubizarreta (3)
  { dniCliente: '30123456', patente: 'GH456IJ', marca: 'Mercedes',   modelo: 'Clase C 200 AMG Line',anio: '2023', color: 'Blanco polar',       combustion: 'Nafta',   tipoVehic: 'Sedán premium' },
  { dniCliente: '30123456', patente: 'KL789MN', marca: 'Lexus',      modelo: 'NX 350h F Sport',     anio: '2022', color: 'Gris nebula',        combustion: 'Híbrido', tipoVehic: 'SUV premium' },
  { dniCliente: '30123456', patente: 'OP012QR', marca: 'Audi',       modelo: 'Q5 40 TFSI S Line',   anio: '2021', color: 'Negro phantom',      combustion: 'Nafta',   tipoVehic: 'SUV premium' },
];

async function seedMoviles(clienteMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Móviles ---');
  const map: Record<string, { id: number; uuid: string }> = {};
  for (const m of MOVILES) {
    const cliente = clienteMap[m.dniCliente];
    if (!cliente) { console.log(`  [WARN] Sin cliente DNI ${m.dniCliente}`); continue; }
    const { dniCliente, ...data } = m;
    const n = await prisma.temas.create({ data: { ...data, clienteId: cliente.id } });
    console.log(`  [OK] ${m.patente} ${m.marca} ${m.modelo} → id=${n.id}`);
    map[m.patente] = { id: n.id, uuid: n.uuid };
  }
  return map;
}

// ─── Partes ───────────────────────────────────────────────────────────────────

const PARTES = [
  { nombre: 'Parte Delantera',   abreviatura: 'PD'  },
  { nombre: 'Parte Trasera',     abreviatura: 'PT'  },
  { nombre: 'Lateral Derecho',   abreviatura: 'LD'  },
  { nombre: 'Lateral Izquierdo', abreviatura: 'LI'  },
  { nombre: 'Techo',             abreviatura: 'TCH' },
  { nombre: 'Maletero / Portón', abreviatura: 'ML'  },
  { nombre: 'Piso y Estructura', abreviatura: 'PE'  },
  { nombre: 'Tren Delantero',    abreviatura: 'TD'  },
];

async function seedPartes() {
  console.log('\n--- Partes ---');
  const map: Record<string, number> = {};
  for (const p of PARTES) {
    const n = await prisma.partes.create({ data: p });
    console.log(`  [OK] ${p.nombre} (${p.abreviatura}) → id=${n.id}`);
    map[p.nombre] = n.id;
  }
  return map;
}

// ─── Piezas ───────────────────────────────────────────────────────────────────

const PIEZAS_DEF = [
  // Parte Delantera — chapa
  { parte: 'Parte Delantera',   nombre: 'Paragolpe delantero', tipo: 'chapa',   costo: 18000, horas: 2.5, costoPorPano: 0,     panos: 0   },
  { parte: 'Parte Delantera',   nombre: 'Capot',               tipo: 'chapa',   costo: 22000, horas: 4,   costoPorPano: 0,     panos: 0   },
  { parte: 'Parte Delantera',   nombre: 'Aleta del. der.',     tipo: 'chapa',   costo: 20000, horas: 3,   costoPorPano: 0,     panos: 0   },
  { parte: 'Parte Delantera',   nombre: 'Aleta del. izq.',     tipo: 'chapa',   costo: 20000, horas: 3,   costoPorPano: 0,     panos: 0   },
  // Parte Trasera — chapa
  { parte: 'Parte Trasera',     nombre: 'Paragolpe trasero',   tipo: 'chapa',   costo: 16000, horas: 2,   costoPorPano: 0,     panos: 0   },
  { parte: 'Parte Trasera',     nombre: 'Aleta tras. der.',    tipo: 'chapa',   costo: 24000, horas: 5,   costoPorPano: 0,     panos: 0   },
  { parte: 'Parte Trasera',     nombre: 'Aleta tras. izq.',    tipo: 'chapa',   costo: 24000, horas: 5,   costoPorPano: 0,     panos: 0   },
  { parte: 'Parte Trasera',     nombre: 'Portón trasero',      tipo: 'chapa',   costo: 28000, horas: 6,   costoPorPano: 0,     panos: 0   },
  // Lateral Derecho — chapa
  { parte: 'Lateral Derecho',   nombre: 'Puerta del. der.',    tipo: 'chapa',   costo: 25000, horas: 5,   costoPorPano: 0,     panos: 0   },
  { parte: 'Lateral Derecho',   nombre: 'Puerta tras. der.',   tipo: 'chapa',   costo: 22000, horas: 4.5, costoPorPano: 0,     panos: 0   },
  { parte: 'Lateral Derecho',   nombre: 'Estribo der.',        tipo: 'chapa',   costo: 18000, horas: 3,   costoPorPano: 0,     panos: 0   },
  // Lateral Izquierdo — chapa
  { parte: 'Lateral Izquierdo', nombre: 'Puerta del. izq.',    tipo: 'chapa',   costo: 25000, horas: 5,   costoPorPano: 0,     panos: 0   },
  { parte: 'Lateral Izquierdo', nombre: 'Puerta tras. izq.',   tipo: 'chapa',   costo: 22000, horas: 4.5, costoPorPano: 0,     panos: 0   },
  { parte: 'Lateral Izquierdo', nombre: 'Estribo izq.',        tipo: 'chapa',   costo: 18000, horas: 3,   costoPorPano: 0,     panos: 0   },
  // Techo — chapa
  { parte: 'Techo',             nombre: 'Techo completo',      tipo: 'chapa',   costo: 35000, horas: 8,   costoPorPano: 0,     panos: 0   },
  { parte: 'Techo',             nombre: 'Pilar A der.',        tipo: 'chapa',   costo: 20000, horas: 3.5, costoPorPano: 0,     panos: 0   },
  { parte: 'Techo',             nombre: 'Pilar A izq.',        tipo: 'chapa',   costo: 20000, horas: 3.5, costoPorPano: 0,     panos: 0   },
  // Parte Delantera — pintura
  { parte: 'Parte Delantera',   nombre: 'Paragolpe delantero', tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 25000, panos: 1.5 },
  { parte: 'Parte Delantera',   nombre: 'Capot',               tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 32000, panos: 3   },
  { parte: 'Parte Delantera',   nombre: 'Aleta del. der.',     tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 28000, panos: 2   },
  { parte: 'Parte Delantera',   nombre: 'Aleta del. izq.',     tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 28000, panos: 2   },
  // Parte Trasera — pintura
  { parte: 'Parte Trasera',     nombre: 'Paragolpe trasero',   tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 22000, panos: 1.5 },
  { parte: 'Parte Trasera',     nombre: 'Aleta tras. der.',    tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 35000, panos: 2.5 },
  { parte: 'Parte Trasera',     nombre: 'Portón trasero',      tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 38000, panos: 3   },
  // Lateral Derecho — pintura
  { parte: 'Lateral Derecho',   nombre: 'Puerta del. der.',    tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 32000, panos: 2.5 },
  { parte: 'Lateral Derecho',   nombre: 'Puerta tras. der.',   tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 28000, panos: 2   },
  // Lateral Izquierdo — pintura
  { parte: 'Lateral Izquierdo', nombre: 'Puerta del. izq.',    tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 32000, panos: 2.5 },
  { parte: 'Lateral Izquierdo', nombre: 'Puerta tras. izq.',   tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 28000, panos: 2   },
  // Techo — pintura
  { parte: 'Techo',             nombre: 'Techo completo',      tipo: 'pintura', costo: 0,     horas: 0,   costoPorPano: 45000, panos: 4.5 },
];

async function seedPiezas(parteMap: Record<string, number>) {
  console.log('\n--- Piezas ---');
  let count = 0;
  for (const p of PIEZAS_DEF) {
    const parteId = parteMap[p.parte];
    if (!parteId) { console.log(`  [WARN] Sin parte: ${p.parte}`); continue; }
    const { parte, ...data } = p;
    await prisma.piezas.create({ data: { ...data, parteId } });
    count++;
  }
  console.log(`  [OK] ${count} piezas creadas`);
}

// ─── Presupuestos ─────────────────────────────────────────────────────────────

const PRESUPUESTOS = [
  // Biolcati — BMW X5 (Finalizado + Pendiente)
  { key: 'X5-1',       patente: 'AB123CD', monto: '320000',  estado: 'Finalizado', tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección de swirls y rayaduras finas en toda la carrocería. Proceso de tres pasos con pulidora orbital. Acabado espejo.', magnitudDanio: '["Leve"]' },
  { key: 'X5-2',       patente: 'AB123CD', monto: '920000',  estado: 'Pendiente',  tipoTrabajo: 'PPF + cerámico',         observaciones: 'Aplicación de film protector PPF Xpel Ultimate Plus en zonas de impacto + sellado cerámico Gyeon Q2 completo.', magnitudDanio: '["Leve"]' },
  // Biolcati — Mercedes Clase E (Finalizado)
  { key: 'MBE-1',      patente: 'EF456GH', monto: '280000',  estado: 'Finalizado', tipoTrabajo: 'Detailing premium',      observaciones: 'Detailing show car completo: descontaminación química, corrección etapa 1, cera Concours de Carnauba. Interior tratado con cuero Colourlock.', magnitudDanio: '["Leve"]' },
  { key: 'MBE-2',      patente: 'EF456GH', monto: '680000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura capot y guardabarros delanteros por granizo. Pintura PPG bicapa código original Mercedes 197 Negro Obsidiana.', magnitudDanio: '["Medio"]',
    pinturaRows: '[{"id":8001,"parte":"Parte Delantera","piezas":"Capot","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Capot desmontado. Impactos de granizo en zona central. 3 capas base Mercedes 197 + 2 capas barniz.","horas":18,"costo":96000},{"id":8002,"parte":"Parte Delantera","piezas":"Aleta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta desmontada. Granizo uniforme en superficie. Base + barniz completo.","horas":12,"costo":56000},{"id":8003,"parte":"Parte Delantera","piezas":"Aleta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta desmontada. Granizo uniforme en superficie. Base + barniz completo.","horas":12,"costo":56000}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":208000,"horas":42,"diasPanos":7,"materiales":"Base Mercedes 197 Negro Obsidiana bicapa PPG, barniz 2K Sikkens Autoclear Plus, catalizador MS"}}' },
  // Biolcati — Porsche Macan (En curso)
  { key: 'MACAN-1',    patente: 'IJ789KL', monto: '1450000', estado: 'Aprobado',   tipoTrabajo: 'Pintura completa',       observaciones: 'Cambio de color completo de Blanco platino a Azul Gentian metalizado. Desmontaje total, imprimación epóxica, dos capas base y dos capas laca.',
    pinturaRows: '[{"id":3001,"parte":"Parte Delantera","piezas":"Paragolpe delantero","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Desmontado. Base Azul Gentian Porsche + barniz premium.","horas":9,"costo":37500},{"id":3002,"parte":"Parte Delantera","piezas":"Capot","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Capot desmontado. 3 capas base + 2 capas barniz.","horas":18,"costo":96000},{"id":3003,"parte":"Parte Delantera","piezas":"Aleta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta desmontada. Transicion perfecta hacia puerta.","horas":12,"costo":56000},{"id":3004,"parte":"Parte Delantera","piezas":"Aleta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta desmontada. Transicion perfecta hacia puerta.","horas":12,"costo":56000},{"id":3005,"parte":"Lateral Derecho","piezas":"Puerta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Pintura completa interior y exterior.","horas":15,"costo":80000},{"id":3006,"parte":"Lateral Derecho","piezas":"Puerta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Pintura completa.","horas":12,"costo":56000},{"id":3007,"parte":"Lateral Izquierdo","piezas":"Puerta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Pintura completa interior y exterior.","horas":15,"costo":80000},{"id":3008,"parte":"Lateral Izquierdo","piezas":"Puerta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Pintura completa.","horas":12,"costo":56000},{"id":3009,"parte":"Techo","piezas":"Techo completo","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Techo desmontado. 4.5 panos. Zona mas compleja.","horas":27,"costo":202500},{"id":3010,"parte":"Parte Trasera","piezas":"Aleta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Difuminado en union con techo y porton.","horas":15,"costo":87500},{"id":3011,"parte":"Parte Trasera","piezas":"Aleta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Difuminado en union con techo y porton.","horas":15,"costo":87500},{"id":3012,"parte":"Parte Trasera","piezas":"Paragolpe trasero","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Desmontado. Base + barniz completo.","horas":9,"costo":33000}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":927500,"horas":180,"diasPanos":25,"materiales":"Pintura Porsche Azul Gentian metalizado bicapa, barniz premium, catalizador MS, 12 latas base + 8 latas barniz"}}', magnitudDanio: '["Medio"]' },
  // Urquiza — Audi Q7 (Finalizado)
  { key: 'Q7-1',       patente: 'MN012OP', monto: '480000',  estado: 'Finalizado', tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura puerta delantera izquierda y espejo retrovisor. Daño por roce en garaje. Color Audi código LZ9Y Negro Mythos perlado.',
    pinturaRows: '[{"id":4001,"parte":"Lateral Izquierdo","piezas":"Puerta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Base Audi LZ9Y Negro Mythos perlado. 2.5 panos + difuminado hacia aleta.","horas":15,"costo":80000},{"id":4002,"parte":"Parte Delantera","piezas":"Aleta del. izq.","pintarDifuminar":"Difuminar","tipoPintura":"Bicapa","especificacion":"Difuminado en aleta izquierda para transicion perfecta con puerta.","horas":12,"costo":56000}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":136000,"horas":27,"diasPanos":4.5,"materiales":"Base Audi LZ9Y Negro Mythos perlado, barniz 2K Glasurit 923, diluyente premium"}}', magnitudDanio: '["Medio"]' },
  { key: 'Q7-2',       patente: 'MN012OP', monto: '780000',  estado: 'En curso',   tipoTrabajo: 'Cerámico y PPF parcial', observaciones: 'Sellado cerámico Gtechniq Crystal Serum Ultra en carrocería completa. PPF en paragolpes delantero y espejo.', magnitudDanio: '["Leve"]',
    chapaRows:   '[{"id":1040,"parte":"Parte Delantera","piezas":"Paragolpe delantero","accion":"Reparar","especificacion":"Rectificado leve de micro-deformaciones previo a PPF. Sin daño estructural. Solo preparacion de superficie.","horas":2,"costo":40000}]',
    pinturaRows: '[{"id":13001,"parte":"Parte Delantera","piezas":"Aleta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Corrección de hologramas y arañazos previo a aplicacion de ceramico. Pulido 3 etapas + corrección localizada.","horas":6,"costo":39200}]',
    preciosCyP:  '{"chapa":{"costo":40000,"horas":2,"diasPanos":0.5,"materiales":"Herramienta PDR, alicate de carrocero, guante termoplastico"},"pintura":{"costo":39200,"horas":6,"diasPanos":1,"materiales":"Polish Menzerna SF4500, pad microfiber, polish fino Gtechniq P-Flex, corrector localizado"}}' },
  // Urquiza — Volvo XC90 (En curso)
  { key: 'XC90-1',     patente: 'QR345ST', monto: '520000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura techo panorámico y pilares por oxidación superficial. Proceso de lijado fino, imprimación y laca Volvo código 717 Plateado.', magnitudDanio: '["Leve"]',
    pinturaRows: '[{"id":9001,"parte":"Techo","piezas":"Techo completo","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Techo panoramico. Oxidacion superficial lijada hasta metal sano. Imprimacion epoxi + bicapa Volvo 717 Plateado.","horas":27,"costo":202500},{"id":9002,"parte":"Parte Delantera","piezas":"Pilar A der.","pintarDifuminar":"Difuminar","tipoPintura":"Bicapa","especificacion":"Difuminado desde techo hacia pilar A derecho. Transicion sobre goma de sellado.","horas":6,"costo":28000},{"id":9003,"parte":"Parte Delantera","piezas":"Pilar A izq.","pintarDifuminar":"Difuminar","tipoPintura":"Bicapa","especificacion":"Difuminado desde techo hacia pilar A izquierdo. Transicion sobre goma de sellado.","horas":6,"costo":28000}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":258500,"horas":39,"diasPanos":6.5,"materiales":"Base Volvo 717 Plateado metalizado, barniz Sikkens Autoclear Plus, imprimacion epoxi PPG DP90, desengrasante MP580"}}' },
  // Rocca — BMW Serie 5 (Finalizado)
  { key: 'BMW5-1',     patente: 'UV678WX', monto: '750000',  estado: 'Finalizado', tipoTrabajo: 'Chapa y pintura',        observaciones: 'Reparación lateral izquierdo completo por accidente: puerta delantera y trasera. Enderezado de chapa, masillado, imprimación y pintura BMW código 475 Gris Mineral.',
    chapaRows:   '[{"id":1001,"parte":"Lateral Izquierdo","piezas":"Puerta del. izq.","accion":"Reparar","especificacion":"Abolladuras por impacto lateral. Bisagra doblada.","horas":6,"costo":132000},{"id":1002,"parte":"Lateral Izquierdo","piezas":"Puerta tras. izq.","accion":"Reparar","especificacion":"Abolladuras zona inferior y media.","horas":4.5,"costo":90000},{"id":1003,"parte":"Lateral Izquierdo","piezas":"Aleta tras. izq.","accion":"Reparar","especificacion":"Deformacion en arco de rueda. Enderezado y masillado.","horas":5,"costo":120000}]',
    pinturaRows: '[{"id":2001,"parte":"Lateral Izquierdo","piezas":"Puerta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Base BMW 475 Gris Mineral + barniz Sikkens. Match cromatico verificado.","horas":15,"costo":80000},{"id":2002,"parte":"Lateral Izquierdo","piezas":"Puerta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Continuidad con puerta delantera. 2 capas base + 2 capas barniz.","horas":12,"costo":56000},{"id":2003,"parte":"Lateral Izquierdo","piezas":"Aleta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Pintura completa con difuminado en union de techo.","horas":15,"costo":87500}]',
    preciosCyP:  '{"chapa":{"costo":342000,"horas":15.5,"diasPanos":4,"materiales":"Masilla poliester MPI, imprimacion PPG DP90LF, lijadora orbital RUPES"},"pintura":{"costo":223500,"horas":42,"diasPanos":7,"materiales":"Base BMW 475 Gris Mineral PPG, barniz Sikkens Autoclear Plus"}}', magnitudDanio: '["Medio"]' },
  { key: 'BMW5-2',     patente: 'UV678WX', monto: '380000',  estado: 'Pendiente',  tipoTrabajo: 'Corrección y cerámico', observaciones: 'Post-reparación: corrección de pintura para nivelar diferencias de brillo + cerámico Carpro Cquartz Finest Reserve.', magnitudDanio: '["Leve"]' },
  // Rocca — Land Rover Defender (En curso — restauración)
  { key: 'DEFND-1',    patente: 'YZ901AB', monto: '1850000', estado: 'Aprobado',   tipoTrabajo: 'Restauración exterior',  observaciones: 'Restauración completa de carrocería: tratamiento anticorrosión, pintura completa en nuevo color Verde Pangaea, PPF en zonas bajas.', magnitudDanio: '["Grave"]',
    chapaRows:   '[{"id":1030,"parte":"Lateral Derecho","piezas":"Umbral der.","accion":"Reparar","especificacion":"Oxidacion penetrante en umbral. Corte de zona afectada, soldadura de chapa nueva, sellado anticorrosivo Dinitrol 3125.","horas":8,"costo":224000},{"id":1031,"parte":"Lateral Izquierdo","piezas":"Umbral izq.","accion":"Reparar","especificacion":"Oxidacion penetrante en umbral izquierdo. Mismo proceso que lado derecho.","horas":8,"costo":224000},{"id":1032,"parte":"Parte Delantera","piezas":"Aleta del. der.","accion":"Sustituir","especificacion":"Oxidacion severa en arco de rueda. Sustitucion por pieza OEM Land Rover.","horas":4,"costo":96000},{"id":1033,"parte":"Parte Delantera","piezas":"Aleta del. izq.","accion":"Sustituir","especificacion":"Oxidacion severa en arco de rueda. Sustitucion por pieza OEM Land Rover.","horas":4,"costo":96000}]',
    pinturaRows: '[{"id":11001,"parte":"Parte Delantera","piezas":"Capot","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Capot desmontado. Imprimacion epoxi total. Verde Pangaea LR personalizado bicapa.","horas":18,"costo":96000},{"id":11002,"parte":"Parte Delantera","piezas":"Aleta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta nueva OEM. Imprimacion y pintura completa.","horas":12,"costo":56000},{"id":11003,"parte":"Parte Delantera","piezas":"Aleta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta nueva OEM. Imprimacion y pintura completa.","horas":12,"costo":56000},{"id":11004,"parte":"Lateral Derecho","piezas":"Puerta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Imprimacion epoxi. Interior y exterior Verde Pangaea.","horas":15,"costo":80000},{"id":11005,"parte":"Lateral Derecho","piezas":"Puerta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Pintura completa.","horas":12,"costo":56000},{"id":11006,"parte":"Lateral Izquierdo","piezas":"Puerta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Imprimacion epoxi. Interior y exterior Verde Pangaea.","horas":15,"costo":80000},{"id":11007,"parte":"Lateral Izquierdo","piezas":"Puerta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Puerta desmontada. Pintura completa.","horas":12,"costo":56000},{"id":11008,"parte":"Techo","piezas":"Techo completo","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Techo Defender plano. Imprimacion total. Bicapa Verde Pangaea. 3 panos.","horas":18,"costo":108000},{"id":11009,"parte":"Parte Trasera","piezas":"Paragolpe trasero","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Paragolpe desmontado. Verde Pangaea completo.","horas":9,"costo":33000},{"id":11010,"parte":"Maletero / Portón","piezas":"Portón trasero","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Compuerta desmontada. Interior y exterior. Bisagras revisadas.","horas":18,"costo":114000}]',
    preciosCyP:  '{"chapa":{"costo":640000,"horas":24,"diasPanos":5,"materiales":"Chapa OEM LR x2 aletas, soldadura MIG, Dinitrol 3125 anticorrosivo, masilla Glasurit epoxi"},"pintura":{"costo":735000,"horas":141,"diasPanos":23.5,"materiales":"Verde Pangaea LR personalizado bicapa, imprimacion epoxi PPG DP90LF, barniz 2K alta resistencia, PPF STEK DYNOshield zonas bajas"}}' },
  // Rocca — Audi A5 (Programado)
  { key: 'A5-1',       patente: 'CD234EF', monto: '340000',  estado: 'Aprobado',   tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección de rayones superficiales y micro-rayaduras por lavado automático. Proceso de dos pasos, acabado showroom.', magnitudDanio: '["Leve"]' },
  // Etchegoyen — Mercedes GLE (Finalizado)
  { key: 'GLE-1',      patente: 'GH567IJ', monto: '350000',  estado: 'Finalizado', tipoTrabajo: 'Detailing premium',      observaciones: 'Detailing integral: decontaminación de barro de ruta, pulido en una etapa, sellado con cera Natural Wax Champion. Limpieza de llantas y frenos.', magnitudDanio: '["Leve"]' },
  { key: 'GLE-2',      patente: 'GH567IJ', monto: '560000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura paragolpe trasero y difusor por golpe en cochera. Mercedes código 149 Beige Arena perlado, dos capas base + barniz.',
    chapaRows:   '[{"id":6001,"parte":"Parte Trasera","piezas":"Paragolpe trasero","accion":"Reparar","especificacion":"Deformacion leve por golpe en cochera. Soporte plastico rajado.","horas":2.5,"costo":40000}]',
    pinturaRows: '[{"id":7001,"parte":"Parte Trasera","piezas":"Paragolpe trasero","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Paragolpe completo. Base Mercedes 149 Beige Arena perlado + barniz.","horas":9,"costo":33000},{"id":7002,"parte":"Parte Trasera","piezas":"Aleta tras. der.","pintarDifuminar":"Difuminar","tipoPintura":"Bicapa","especificacion":"Difuminado en aleta trasera der. para transicion con carroceria.","horas":15,"costo":87500}]',
    preciosCyP:  '{"chapa":{"costo":40000,"horas":2.5,"diasPanos":1,"materiales":"Masilla superficial, soporte paragolpe plastico, adhesivo estructural"},"pintura":{"costo":120500,"horas":24,"diasPanos":4,"materiales":"Base Mercedes 149 Beige Arena perlado, barniz 2K Glasurit, catalizador MS"}}', magnitudDanio: '["Leve"]' },
  // Etchegoyen — Land Cruiser Prado (Programado)
  { key: 'PRADO-1',    patente: 'KL890MN', monto: '620000',  estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',        observaciones: 'Reparación lateral derecho completo: puerta trasera y aleta. Enderezado, masillado y pintura Toyota código 202 Negro Super White II.', magnitudDanio: '["Medio"]',
    chapaRows:   '[{"id":1020,"parte":"Lateral Derecho","piezas":"Puerta tras. der.","accion":"Reparar","especificacion":"Impacto lateral zona inferior. Abolladuras medianas. Bisagra sin daño. Enderezado y masillado.","horas":4,"costo":80000},{"id":1021,"parte":"Lateral Derecho","piezas":"Aleta tras. der.","accion":"Reparar","especificacion":"Deformacion en arco de rueda y panel lateral. Enderezado en banco y masillado con poliester.","horas":5,"costo":120000}]',
    pinturaRows: '[{"id":2020,"parte":"Lateral Derecho","piezas":"Puerta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Base Toyota 202. Bicapa. Match de color con puerta delantera verificado con colorimetro.","horas":12,"costo":56000},{"id":2021,"parte":"Lateral Derecho","piezas":"Aleta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta reparada. Pintura completa con difuminado en union con techo lateral.","horas":15,"costo":87500},{"id":2022,"parte":"Lateral Derecho","piezas":"Puerta del. der.","pintarDifuminar":"Difuminar","tipoPintura":"Bicapa","especificacion":"Difuminado necesario para transicion perfecta con puerta trasera reparada.","horas":9,"costo":33000}]',
    preciosCyP:  '{"chapa":{"costo":200000,"horas":9,"diasPanos":2,"materiales":"Masilla poliester Glasurit, imprimacion epoxi PPG DP90LF, lijadora orbital, abrasivos P80-P180-P320"},"pintura":{"costo":176500,"horas":36,"diasPanos":6,"materiales":"Base Toyota 202 PPG, barniz Sikkens Autoclear Plus, diluyente rapido, catalizador MS"}}' },
  // Llambías — Lexus LX (Finalizado — PPF)
  { key: 'LX-1',       patente: 'OP123QR', monto: '720000',  estado: 'Finalizado', tipoTrabajo: 'PPF parcial',            observaciones: 'Aplicación de film PPF STEK DYNOshield en capot, guardabarros, retrovisores y espejo delantero. Protección mínima visible.', magnitudDanio: '["Leve"]' },
  { key: 'LX-2',       patente: 'OP123QR', monto: '280000',  estado: 'Pendiente',  tipoTrabajo: 'Detailing express',      observaciones: 'Pulido express y cerámico de mantenimiento Gtechniq EXOv5. Incluye limpieza de frenos y llantas de 24".', magnitudDanio: '["Leve"]' },
  // Llambías — Ford Ranger Raptor (Programado)
  { key: 'RAPTOR-1',   patente: 'ST456UV', monto: '780000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura completa',       observaciones: 'Cambio de color de Gris Eclipse a Negro Panther mate. Vinilo vinílico de alta calidad o pintura mate 3M, tratamiento UV.', magnitudDanio: '["Medio"]',
    pinturaRows: '[{"id":10001,"parte":"Parte Delantera","piezas":"Paragolpe delantero","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Paragolpe desmontado. Cambio color completo Negro Panther Mate 3M.","horas":9,"costo":33000},{"id":10002,"parte":"Parte Delantera","piezas":"Capot","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Capot desmontado. Superficie desengrasada. Monocapa mate uniforme.","horas":18,"costo":96000},{"id":10003,"parte":"Parte Delantera","piezas":"Aleta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Aleta desmontada. Cambio color completo.","horas":12,"costo":56000},{"id":10004,"parte":"Parte Delantera","piezas":"Aleta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Aleta desmontada. Cambio color completo.","horas":12,"costo":56000},{"id":10005,"parte":"Lateral Derecho","piezas":"Puerta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Puerta desmontada. Interior y exterior. Cambio color.","horas":15,"costo":80000},{"id":10006,"parte":"Lateral Derecho","piezas":"Puerta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Puerta desmontada. Pintura completa.","horas":12,"costo":56000},{"id":10007,"parte":"Lateral Izquierdo","piezas":"Puerta del. izq.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Puerta desmontada. Interior y exterior. Cambio color.","horas":15,"costo":80000},{"id":10008,"parte":"Lateral Izquierdo","piezas":"Puerta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Puerta desmontada. Pintura completa.","horas":12,"costo":56000},{"id":10009,"parte":"Techo","piezas":"Techo completo","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Techo desmontado. 4.5 panos. Aplicacion uniforme mate en cabina.","horas":27,"costo":202500},{"id":10010,"parte":"Parte Trasera","piezas":"Aleta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Aleta trasera. Cambio color con difuminado en union techo.","horas":15,"costo":87500},{"id":10011,"parte":"Parte Trasera","piezas":"Aleta tras. izq.","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Aleta trasera. Cambio color con difuminado en union techo.","horas":15,"costo":87500},{"id":10012,"parte":"Parte Trasera","piezas":"Paragolpe trasero","pintarDifuminar":"Pintar","tipoPintura":"Monocapa","especificacion":"Paragolpe desmontado. Monocapa mate aplicada en cabina.","horas":9,"costo":33000}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":923500,"horas":171,"diasPanos":28.5,"materiales":"3M 1080-M12 Negro Panther Mate, promotor adhesion PM700, limpiador superficie IPA, catalizador UV"}}' },
  // Pereyra Iraola — Porsche Cayenne (En curso)
  { key: 'CAYEN-1',    patente: 'AB012CD', monto: '980000',  estado: 'Aprobado',   tipoTrabajo: 'PPF completo',           observaciones: 'PPF total carrocería con Xpel Ultimate Plus, incluyendo techo, pilares y umbrales. Garantía 10 años contra amarillamiento.', magnitudDanio: '["Medio"]' },
  // Pereyra Iraola — BMW 320i (Programado)
  { key: 'BMW3-1',     patente: 'EF345GH', monto: '360000',  estado: 'Aprobado',   tipoTrabajo: 'Corrección y PPF front', observaciones: 'Corrección de pintura en dos pasos + PPF frontal (capot, guardabarros, spoiler) Xpel Stealth acabado satinado.', magnitudDanio: '["Leve"]' },
  // Blaquier — Audi Q8 (En curso)
  { key: 'Q8-1',       patente: 'IJ678KL', monto: '460000',  estado: 'Aprobado',   tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección exhaustiva de tres etapas por rayones de lavadero. Finalizar con cerámico Carpro Cquartz UK 3.0.', magnitudDanio: '["Medio"]' },
  // Blaquier — AMG C63 (Programado)
  { key: 'AMG-1',      patente: 'MN901OP', monto: '320000',  estado: 'Aprobado',   tipoTrabajo: 'Detailing premium',      observaciones: 'Detailing show car: corrección, cera hand-applied Swissvax Crystal Rock. Interior: tratamiento de cuero y fibra de carbono.', magnitudDanio: '["Leve"]' },
  // Aráoz — Volvo XC60 (Finalizado)
  { key: 'XC60-1',     patente: 'QR234ST', monto: '260000',  estado: 'Finalizado', tipoTrabajo: 'Pulido y sellado',       observaciones: 'Pulido en una etapa para eliminar hazing post-invierno. Sellado con Gyeon Q2 Syncro, durabilidad 2 años.', magnitudDanio: '["Leve"]' },
  { key: 'XC60-2',     patente: 'QR234ST', monto: '540000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura capot y aleta delantera derecha por impacto de piedra en ruta. Volvo código código 452 Azul Osmium metalizado.', magnitudDanio: '["Leve"]',
    pinturaRows: '[{"id":14001,"parte":"Parte Delantera","piezas":"Capot","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Capot desmontado. Impactos de piedra en zona delantera. Base Volvo 452 Azul Osmium metalizado + barniz.","horas":18,"costo":96000},{"id":14002,"parte":"Parte Delantera","piezas":"Aleta del. der.","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Aleta desmontada. Impactos menores en borde delantero. Pintura completa con difuminado.","horas":12,"costo":56000}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":152000,"horas":30,"diasPanos":5,"materiales":"Base Volvo 452 Azul Osmium metalizado, barniz Sikkens Autoclear Plus, diluyente lento, catalizador"}}' },
  // Duggan — Range Rover Sport (Finalizado)
  { key: 'RRS-1',      patente: 'YZ890AB', monto: '980000',  estado: 'Finalizado', tipoTrabajo: 'Chapa y pintura',        observaciones: 'Reparación trasero completo por accidente: paragolpe, aleta y compuerta. Land Rover código 1AT Negro Santorini perlado. Cubierto por seguro SANCOR.',
    chapaRows:   '[{"id":1010,"parte":"Parte Trasera","piezas":"Paragolpe trasero","accion":"Reparar","especificacion":"Impacto trasero. Soporte interno roto. Reparacion y refuerzo.","horas":2.5,"costo":40000},{"id":1011,"parte":"Parte Trasera","piezas":"Aleta tras. der.","accion":"Sustituir","especificacion":"Deformacion severa. Sustitucion aleta OEM Land Rover.","horas":5,"costo":120000},{"id":1012,"parte":"Maletero / Portón","piezas":"Portón trasero","accion":"Reparar","especificacion":"Portón torcido en bisagra izquierda. Enderezado en banco Celette.","horas":6,"costo":168000}]',
    pinturaRows: '[{"id":2010,"parte":"Parte Trasera","piezas":"Paragolpe trasero","pintarDifuminar":"Pintar","tipoPintura":"Tricapa","especificacion":"LR 1AT Negro Santorini perlado. Tricapa nacar + barniz alta resistencia.","horas":9,"costo":33000},{"id":2011,"parte":"Parte Trasera","piezas":"Aleta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Tricapa","especificacion":"Aleta nueva. Difuminado en union con carroceria original.","horas":15,"costo":87500},{"id":2012,"parte":"Maletero / Portón","piezas":"Portón trasero","pintarDifuminar":"Pintar","tipoPintura":"Tricapa","especificacion":"Tricapa perlada bajo cabina de temperatura controlada.","horas":18,"costo":114000}]',
    preciosCyP:  '{"chapa":{"costo":328000,"horas":13.5,"diasPanos":4,"materiales":"Masilla Glasurit, imprimacion epoxica, aleta OEM LR, banco Celette"},"pintura":{"costo":234500,"horas":42,"diasPanos":7,"materiales":"LR 1AT Negro Santorini perlado (tricapa), barniz alta resistencia, diluyente nacar"}}', magnitudDanio: '["Grave"]' },
  // Duggan — Jaguar F-Pace (Programado)
  { key: 'FPACE-1',    patente: 'CD123EF', monto: '560000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura capot y techo por granizo. Jaguar código 2202 Rojo Caldera metalizado, proceso en cabina de temperatura controlada.', magnitudDanio: '["Medio"]',
    pinturaRows: '[{"id":12001,"parte":"Parte Delantera","piezas":"Capot","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Capot desmontado. Impactos de granizo en superficie completa. Jaguar 2202 Rojo Caldera metalizado bicapa en cabina.","horas":18,"costo":96000},{"id":12002,"parte":"Techo","piezas":"Techo completo","pintarDifuminar":"Pintar","tipoPintura":"Bicapa","especificacion":"Techo 4.5 panos. Granizo en toda la superficie. Proceso en cabina temperatura controlada 20°C.","horas":27,"costo":202500}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":298500,"horas":45,"diasPanos":7.5,"materiales":"Base Jaguar 2202 Rojo Caldera metalizado bicapa, barniz 2K alta resistencia temperatura controlada, catalizador MS"}}' },
  // Zubizarreta — Mercedes Clase C (Finalizado)
  { key: 'MBC-1',      patente: 'GH456IJ', monto: '420000',  estado: 'Finalizado', tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura puerta trasera derecha y aleta por roce en estacionamiento. Mercedes código 149 Blanco Polar, tricapa con efecto perla.',
    pinturaRows: '[{"id":5001,"parte":"Lateral Derecho","piezas":"Puerta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Tricapa","especificacion":"Mercedes 149 Blanco Polar tricapa. 3 capas nacar + 2 capas barniz.","horas":12,"costo":72800},{"id":5002,"parte":"Parte Trasera","piezas":"Aleta tras. der.","pintarDifuminar":"Pintar","tipoPintura":"Tricapa","especificacion":"Aleta trasera der. Tricapa perlada. Difuminado en union con puerta.","horas":15,"costo":113750}]',
    preciosCyP:  '{"chapa":{"costo":0,"horas":0,"diasPanos":0,"materiales":""},"pintura":{"costo":186550,"horas":27,"diasPanos":4.5,"materiales":"Base Mercedes 149 Blanco Polar (tricapa nacar), barniz 2K alta resistencia, diluyente perlado"}}', magnitudDanio: '["Leve"]' },
  // Zubizarreta — Lexus NX (Programado)
  { key: 'NX-1',       patente: 'KL789MN', monto: '520000',  estado: 'Aprobado',   tipoTrabajo: 'PPF + cerámico',         observaciones: 'Aplicación PPF Xpel en zonas de impacto y cerámico Gyeon Q2 completo. Protección total con garantía de instalación.', magnitudDanio: '["Leve"]' },
  // Zubizarreta — Audi Q5 (Pendiente)
  { key: 'Q5-1',       patente: 'OP012QR', monto: '350000',  estado: 'Pendiente',  tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección de oxidación leve en techo y capot. Pre-inspección realizada, esperando aprobación del cliente.', magnitudDanio: '["Leve"]' },
];

async function seedPresupuestos(movilMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Presupuestos ---');
  const map: Record<string, { id: number; uuid: string }> = {};
  for (const p of PRESUPUESTOS) {
    const movil = movilMap[p.patente];
    if (!movil) { console.log(`  [WARN] Sin móvil ${p.patente}`); continue; }
    const { key, ...data } = p;
    const n = await prisma.presupuestos.create({ data: { ...data, movilId: String(movil.id) } });
    console.log(`  [OK] ${key} — ${p.patente} $${p.monto} (${p.estado})`);
    map[key] = { id: n.id, uuid: n.uuid };
  }
  return map;
}

// ─── Turnos ───────────────────────────────────────────────────────────────────

const TURNOS = [
  // ── Finalizados (histórico enero-marzo 2026) ─────────────────────────────────
  // 10 h: pulido completo en jornada única
  { key: 'T-X5-1',     presKey: 'X5-1',    plaza: 1, ini: '2026-01-08T08:00', fin: '2026-01-08T18:00', iniR: '2026-01-08T08:30', finR: '2026-01-08T17:45', estado: 'Finalizado', obs: 'Corrección de swirls tres pasos. Entregado con brillo espejo. Cliente muy conforme.' },
  // 1.5 días: detailing + interior 08:00 lunes → 14:00 martes
  { key: 'T-MBE-1',    presKey: 'MBE-1',   plaza: 2, ini: '2026-01-14T08:00', fin: '2026-01-15T14:00', iniR: '2026-01-14T09:00', finR: '2026-01-15T13:30', estado: 'Finalizado', obs: 'Detailing completo interior y exterior. Entregado mediodía del día siguiente. Showroom.' },
  // 2 días: repintura puerta 08:00 lunes → 18:00 martes
  { key: 'T-Q7-1',     presKey: 'Q7-1',    plaza: 3, ini: '2026-01-27T08:00', fin: '2026-01-28T18:00', iniR: '2026-01-27T08:00', finR: '2026-01-28T17:00', estado: 'Finalizado', obs: 'Puerta izquierda chapada y pintada. Match de color perfecto con PPG. Retiró conforme.' },
  // 1.5 días: chapa lateral leve + pintura parcial
  { key: 'T-BMW5-1',   presKey: 'BMW5-1',  plaza: 4, ini: '2026-02-03T08:00', fin: '2026-02-04T14:00', iniR: '2026-02-03T08:00', finR: '2026-02-04T13:30', estado: 'Finalizado', obs: 'Puertas laterales reparadas y pintadas. Sin diferencia de tono con el original.' },
  // 10 h: detailing premium jornada completa
  { key: 'T-GLE-1',    presKey: 'GLE-1',   plaza: 5, ini: '2026-02-17T08:00', fin: '2026-02-17T18:00', iniR: '2026-02-17T08:30', finR: '2026-02-17T17:30', estado: 'Finalizado', obs: 'Detailing express: pulido, tratamiento de cuero y sellado hidrofóbico. Entrega en tiempo.' },
  // 2 días: PPF capot + parabrisas + paragolpes
  { key: 'T-LX-1',     presKey: 'LX-1',    plaza: 6, ini: '2026-02-24T08:00', fin: '2026-02-25T18:00', iniR: '2026-02-24T08:00', finR: '2026-02-25T16:00', estado: 'Finalizado', obs: 'PPF instalado sin burbujas. Inspección bajo UV aprobada. Ajuste de cantos perfecto.' },
  // 10 h: pulido y sellado cerámico en jornada
  { key: 'T-XC60-1',   presKey: 'XC60-1',  plaza: 1, ini: '2026-03-04T08:00', fin: '2026-03-04T18:00', iniR: '2026-03-04T08:30', finR: '2026-03-04T17:00', estado: 'Finalizado', obs: 'Pulido y sellado cerámico Gyeon completado en jornada. Resultado excelente.' },
  // 1.5 días: chapa trasera post-colisión
  { key: 'T-RRS-1',    presKey: 'RRS-1',   plaza: 2, ini: '2026-03-10T08:00', fin: '2026-03-11T14:00', iniR: '2026-03-10T08:00', finR: '2026-03-11T13:30', estado: 'Finalizado', obs: 'Paragolpes trasero chapado y pintado. Cubierto por SANCOR. Entrega mediodía conforme.' },
  // 2 días: pintura puerta + aleta tricapa
  { key: 'T-MBC-1',    presKey: 'MBC-1',   plaza: 3, ini: '2026-03-18T08:00', fin: '2026-03-19T18:00', iniR: '2026-03-18T09:00', finR: '2026-03-19T17:00', estado: 'Finalizado', obs: 'Puerta trasera y aleta. Pintura tricapa perfectamente nivelada. Sin diferencia de tono.' },
  // ── En curso (semana del 24-mar-2026) ────────────────────────────────────────
  // 2 días: pintura total — arrancó lunes, entrega miércoles
  { key: 'T-MACAN-1',  presKey: 'MACAN-1', plaza: 1, ini: '2026-03-24T08:00', fin: '2026-03-25T18:00', iniR: '2026-03-24T08:00', finR: null, estado: 'En curso', obs: 'Pintura total: desmontaje completo realizado, imprimación aplicada. Base color en proceso.' },
  // 1.5 días: restauración parcial — arrancó lunes, cierra martes al mediodía
  { key: 'T-DEFND-1',  presKey: 'DEFND-1', plaza: 2, ini: '2026-03-24T08:00', fin: '2026-03-25T14:00', iniR: '2026-03-24T08:30', finR: null, estado: 'En curso', obs: 'Anticorrosión en pisos y umbrales aplicado. Pintura base en cabina. Cierra mañana al mediodía.' },
  // 10 h: techo completo en jornada
  { key: 'T-XC90-1',   presKey: 'XC90-1',  plaza: 3, ini: '2026-03-24T08:00', fin: '2026-03-24T18:00', iniR: '2026-03-24T09:00', finR: null, estado: 'En curso', obs: 'Techo: lijado fino completado, imprimación aplicada. Pintura base en proceso.' },
  // 2 días: PPF total — arrancó martes, cierra miércoles
  { key: 'T-CAYEN-1',  presKey: 'CAYEN-1', plaza: 4, ini: '2026-03-24T08:00', fin: '2026-03-25T18:00', iniR: '2026-03-24T08:00', finR: null, estado: 'En curso', obs: 'PPF Porsche: capot y guardabarros instalados. Faltan puertas y techo. Termina mañana.' },
  // 1.5 días: corrección + cerámico
  { key: 'T-Q8-1',     presKey: 'Q8-1',    plaza: 5, ini: '2026-03-24T08:00', fin: '2026-03-25T13:00', iniR: '2026-03-24T09:00', finR: null, estado: 'En curso', obs: 'Corrección tres pasos: etapas 1 y 2 listas. Mañana paso fino y aplicación de cerámico.' },
  // ── Programados ──────────────────────────────────────────────────────────────
  // 10 h: repintura parcial por granizo
  { key: 'T-MBE-2',    presKey: 'MBE-2',   plaza: 6, ini: '2026-03-31T08:00', fin: '2026-03-31T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Techo y capot afectados por granizo. Insumos PPG ordenados. Cliente confirmó turno.' },
  // 2 días: chapa lateral completa
  { key: 'T-PRADO-1',  presKey: 'PRADO-1', plaza: 1, ini: '2026-04-07T08:00', fin: '2026-04-08T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Chapa lateral Prado. Presupuesto aprobado vía La Segunda. Confirmar recepción el viernes.' },
  // 1.5 días: cambio de color + base + laca
  { key: 'T-RAPTOR-1', presKey: 'RAPTOR-1',plaza: 2, ini: '2026-04-14T08:00', fin: '2026-04-15T14:00', iniR: null, finR: null, estado: 'Programado', obs: 'Cambio a negro mate 3M 1080-M12. Insumo por llegar. Confirmar con cliente 48h antes.' },
  // 10 h: corrección + PPF frontal
  { key: 'T-BMW3-1',   presKey: 'BMW3-1',  plaza: 3, ini: '2026-04-23T08:00', fin: '2026-04-23T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Corrección de swirls + PPF Xpel frontal. Insumo en stock. Jornada completa.' },
  // 2 días: detailing AMG + cerámico
  { key: 'T-AMG-1',    presKey: 'AMG-1',   plaza: 4, ini: '2026-04-28T08:00', fin: '2026-04-29T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Detailing completo AMG C63. Cliente requiere entrega antes del evento de mayo.' },
  // 1.5 días: repintura post-granizo Jaguar
  { key: 'T-FPACE-1',  presKey: 'FPACE-1', plaza: 5, ini: '2026-05-05T08:00', fin: '2026-05-06T14:00', iniR: null, finR: null, estado: 'Programado', obs: 'Techo y capot: repintura post-granizo. Perito ZURICH autorizó. Confirmar materiales.' },
  // 2 días: PPF + cerámico Lexus
  { key: 'T-NX-1',     presKey: 'NX-1',    plaza: 6, ini: '2026-05-12T08:00', fin: '2026-05-13T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'PPF frontal + cerámico completo. Turno coordinado con asistente de la clienta.' },
  // 10 h: corrección Audi A5
  { key: 'T-A5-1',     presKey: 'A5-1',    plaza: 1, ini: '2026-05-19T08:00', fin: '2026-05-19T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Corrección de pintura Audi A5. Confirmar disponibilidad del vehículo con Dr. Rocca.' },
];

// Reparadores asignados por turno (martin / lorena)
const TURNO_REPS: Record<string, string[]> = {
  'T-X5-1':    ['martin'],
  'T-MBE-1':   ['lorena'],
  'T-Q7-1':    ['martin', 'lorena'],
  'T-BMW5-1':  ['martin'],
  'T-GLE-1':   ['lorena'],
  'T-LX-1':    ['martin', 'lorena'],
  'T-XC60-1':  ['lorena'],
  'T-RRS-1':   ['martin'],
  'T-MBC-1':   ['martin', 'lorena'],
  'T-MACAN-1': ['martin'],
  'T-DEFND-1': ['martin', 'lorena'],
  'T-XC90-1':  ['lorena'],
  'T-CAYEN-1': ['martin', 'lorena'],
  'T-Q8-1':    ['martin'],
};

async function seedTurnos(presMap: Record<string, { id: number; uuid: string }>, userMap: Record<string, number>) {
  console.log('\n--- Turnos ---');
  const map: Record<string, { id: number; uuid: string }> = {};
  for (const t of TURNOS) {
    const pres = presMap[t.presKey];
    if (!pres) { console.log(`  [WARN] Sin presupuesto key=${t.presKey}`); continue; }
    const n = await prisma.turnos.create({
      data: {
        presupuestoId: pres.uuid,
        plaza: t.plaza,
        fechaHoraInicioEstimada:  new Date(t.ini),
        fechaHoraFinEstimada:     new Date(t.fin),
        fechaHoraInicioReal:      t.iniR ? new Date(t.iniR) : null,
        fechaHoraFinReal:         t.finR ? new Date(t.finR) : null,
        estado:                   t.estado,
        observaciones:            t.obs,
      },
    });
    // Asignar reparadores
    const reps = (TURNO_REPS[t.key] || []).map((r) => userMap[r]).filter(Boolean);
    if (reps.length > 0) {
      await prisma.turnoReparadores.createMany({
        data: reps.map((userId) => ({ turnoId: n.id, userId })),
      });
    }
    console.log(`  [OK] ${t.key} Plaza ${t.plaza} (${t.estado}) reps=${reps.length} → id=${n.id}`);
    map[t.key] = { id: n.id, uuid: n.uuid };
  }
  return map;
}

// ─── Trabajos Realizados ──────────────────────────────────────────────────────

const TRABAJOS = [
  { turnoKey: 'T-X5-1',   fecha: '2026-01-10T17:00', monto: '320000', desc: 'Corrección de pintura BMW X5 en tres etapas: compuesto de corte 3M Perfect-It III, afinado con polish Menzerna SF4500 y finalizado con Polish One Step Americana. Removido swirls, hologramas y micro-rayaduras. Acabado espejo verificado con reflectómetro.', obs: 'Cliente Biolcati retiró conforme. Solicitó presupuesto para PPF total.' },
  { turnoKey: 'T-MBE-1',  fecha: '2026-01-15T17:30', monto: '280000', desc: 'Detailing completo Mercedes Clase E: lavado de dos baldes, clay bar de descontaminación, corrección etapa 1 con polish Menzerna Power Gloss, sellado con cera Concours de Carnauba Swissvax. Interior: limpieza de cuero con Colourlock Leather Cleaner, acondicionamiento e hidratación. Llantas tratadas con sellador de aluminio.', obs: 'Vehículo entregado en condición showroom. Cliente solicitó turno mensual de mantenimiento.' },
  { turnoKey: 'T-Q7-1',   fecha: '2026-01-29T16:30', monto: '480000', desc: 'Repintura puerta delantera izquierda y espejo retrovisor Audi Q7. Desmontaje de puerta, enderezado leve de marco, aplicación de imprimación epóxica PPG DP90LF, dos capas de base Audi LZ9Y Negro Mythos perlado y tres capas de barniz Sikkens Autoclear Plus. Pulido de bordes y sellado de juntas.', obs: 'Match de color perfecto verificado con colorímetro X-Rite. Sin diferencia visible.' },
  { turnoKey: 'T-BMW5-1', fecha: '2026-02-10T17:00', monto: '750000', desc: 'Chapa y pintura lateral izquierdo completo BMW Serie 5: desmontaje de puertas delantera y trasera, enderezado de chapa con banco de trabajo Celette, masillado con masilla de poliéster MPI, lijado progresivo hasta grano 1200. Imprimación epoxi PPG, base BMW 475 Gris Mineral metalizado y barniz bicapa. Montaje y ajuste de puertas.', obs: 'Trabajo cubierto parcialmente por seguro SMG. Diferencia de $220.000 abonada por el cliente Dr. Rocca.' },
  { turnoKey: 'T-GLE-1',  fecha: '2026-02-18T16:00', monto: '350000', desc: 'Detailing integral Mercedes GLE 400: pre-lavado con snow foam Gyeon Foam, lavado manual de dos baldes, decontaminación química IronX, clay bar. Corrección en una etapa con Menzerna 400, sellado con Gyeon Q2 One. Tratamiento de llantas, neumáticos y frenos. Interior completo: aspirado, vapor, tratamiento tapizados y plásticos.', obs: 'Entrega en tiempo. Sra. Etchegoyen retiró el vehículo muy conforme.' },
  { turnoKey: 'T-LX-1',   fecha: '2026-02-26T15:30', monto: '720000', desc: 'Instalación PPF STEK DYNOshield en Lexus LX 600: capot, guardabarros, retrovisores y spoiler delantero. Corte computarizado por plotter, instalación sin burbujas con solución de montaje. Inspección bajo luz UV y lámpara de revelado. Bordes sellados con calor. Garantía de instalación 2 años, producto 10 años.', obs: 'Sr. Llambías muy satisfecho. Solicitó cotización para PPF total en segunda visita.' },
  { turnoKey: 'T-XC60-1', fecha: '2026-03-04T16:00', monto: '260000', desc: 'Pulido y sellado Volvo XC60: corrección en una etapa con RUPES Bigfoot LHR21 y polish Menzerna SF3500, removido hazing post-invierno. Sellado con Gyeon Q2 Syncro (durabilidad 2 años según condición de uso). Llantas de aluminio tratadas con sellador específico para metales.', obs: 'Trabajo completado en jornada. Resultado excelente, uniformidad de brillo lograda.' },
  { turnoKey: 'T-RRS-1',  fecha: '2026-03-17T17:30', monto: '980000', desc: 'Reparación completa trasero Range Rover Sport: desmontaje de paragolpes, aleta y compuerta trasera. Alineación de carrocería en banco Celette. Enderezado de compuerta, sustitución de aleta derecha, reparación paragolpes. Imprimación PPG, base Land Rover 1AT Negro Santorini perlado (tricapa), barniz de alta resistencia. Ajuste de cierre y sensores de parking.', obs: 'Trabajo cubierto 100% por seguro SANCOR. Perito verificó la reparación in situ. Entrega con total conformidad del Sr. Duggan.' },
  { turnoKey: 'T-MBC-1',  fecha: '2026-03-19T16:30', monto: '420000', desc: 'Repintura puerta trasera derecha y aleta Clase C 200: desmontaje de puerta, preparación de superficie, imprimación PPG DP90LF, base Mercedes 149 Blanco Polar (aplicación especial tricapa perla en tres capas base + barniz). Pulido de transiciones y sellado de bordes. Montaje y verificación de alineación.', obs: 'Sra. Zubizarreta retiró conforme. Match de color tricapa perfectamente ejecutado.' },
];

async function seedTrabajosRealizados(turnoMap: Record<string, { id: number; uuid: string }>) {
  console.log('\n--- Trabajos Realizados ---');
  for (const tr of TRABAJOS) {
    const turno = turnoMap[tr.turnoKey];
    if (!turno) { console.log(`  [WARN] Sin turno key=${tr.turnoKey}`); continue; }
    const n = await prisma.trabajosRealizados.create({
      data: {
        turnoId:      turno.uuid,
        fechaRealiz:  new Date(tr.fecha),
        descripcion:  tr.desc,
        monto:        tr.monto,
        observaciones: tr.obs,
      },
    });
    console.log(`  [OK] ${tr.turnoKey} → trabajoId=${n.id}`);
  }
}

// ─── Horario y Feriados ───────────────────────────────────────────────────────

async function seedHorarioYFeriados() {
  console.log('\n--- Horario del taller ---');
  const HORARIO = [
    { diaSemana: 0, activo: false, horaEntrada: '08:00', horaSalida: '18:00', tieneAlmuerzo: false, inicioAlmuerzo: null, finAlmuerzo: null },
    { diaSemana: 1, activo: true,  horaEntrada: '08:00', horaSalida: '18:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
    { diaSemana: 2, activo: true,  horaEntrada: '08:00', horaSalida: '18:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
    { diaSemana: 3, activo: true,  horaEntrada: '08:00', horaSalida: '18:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
    { diaSemana: 4, activo: true,  horaEntrada: '08:00', horaSalida: '18:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
    { diaSemana: 5, activo: true,  horaEntrada: '08:00', horaSalida: '18:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
    { diaSemana: 6, activo: false, horaEntrada: '08:00', horaSalida: '13:00', tieneAlmuerzo: false, inicioAlmuerzo: null, finAlmuerzo: null },
  ];
  for (const h of HORARIO) {
    await prisma.horarioDia.upsert({
      where:  { diaSemana: h.diaSemana },
      update: h,
      create: h,
    });
  }
  console.log('  [OK] Lun-Vie 08:00-18:00 (almuerzo 12-13) · Sáb-Dom inactivos');

  console.log('--- Feriados nacionales Argentina 2026 ---');
  const FERIADOS = [
    { fecha: '2026-01-01', nombre: 'Año Nuevo',                                         esAnual: true  },
    { fecha: '2026-02-16', nombre: 'Carnaval',                                           esAnual: false },
    { fecha: '2026-02-17', nombre: 'Carnaval',                                           esAnual: false },
    { fecha: '2026-03-24', nombre: 'Día Nacional de la Memoria',                         esAnual: true  },
    { fecha: '2026-04-02', nombre: 'Día del Veterano de Malvinas',                       esAnual: true  },
    { fecha: '2026-04-03', nombre: 'Viernes Santo',                                      esAnual: false },
    { fecha: '2026-05-01', nombre: 'Día del Trabajador',                                 esAnual: true  },
    { fecha: '2026-05-25', nombre: 'Día de la Patria',                                   esAnual: true  },
    { fecha: '2026-06-20', nombre: 'Paso a la Inmortalidad del Gral. Belgrano',          esAnual: true  },
    { fecha: '2026-07-09', nombre: 'Día de la Independencia',                            esAnual: true  },
    { fecha: '2026-08-17', nombre: 'Paso a la Inmortalidad del Gral. San Martín',        esAnual: false },
    { fecha: '2026-10-12', nombre: 'Día del Respeto a la Diversidad Cultural',           esAnual: true  },
    { fecha: '2026-11-20', nombre: 'Día de la Soberanía Nacional',                       esAnual: true  },
    { fecha: '2026-12-08', nombre: 'Inmaculada Concepción de María',                     esAnual: true  },
    { fecha: '2026-12-25', nombre: 'Navidad',                                            esAnual: true  },
  ];
  await prisma.feriado.deleteMany({});
  for (const f of FERIADOS) {
    await prisma.feriado.create({ data: { fecha: new Date(f.fecha), nombre: f.nombre, esAnual: f.esAnual } });
  }
  console.log(`  [OK] ${FERIADOS.length} feriados cargados`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== SEED Galpón 3 Taller — Demo cliente ===');
  await truncateAll();
  const userMap        = await seedUsers();
  const parteMap       = await seedPartes();
  await seedPiezas(parteMap);
  const clienteMap     = await seedClientes();
  const movilMap       = await seedMoviles(clienteMap);
  const presupuestoMap = await seedPresupuestos(movilMap);
  const turnoMap       = await seedTurnos(presupuestoMap, userMap);
  await seedTrabajosRealizados(turnoMap);
  await seedHorarioYFeriados();

  const finalizados = TURNOS.filter(t => t.estado === 'Finalizado').length;
  const enCurso     = TURNOS.filter(t => t.estado === 'En curso').length;
  const programados = TURNOS.filter(t => t.estado === 'Programado').length;

  console.log('\n=== RESUMEN ===');
  console.log(`  Partes:              ${PARTES.length}`);
  console.log(`  Piezas:              ${PIEZAS_DEF.length}`);
  console.log(`  Clientes:            ${CLIENTES.length}`);
  console.log(`  Móviles:             ${MOVILES.length}`);
  console.log(`  Presupuestos:        ${PRESUPUESTOS.length}`);
  console.log(`  Turnos:              ${TURNOS.length} (${finalizados} finalizados, ${enCurso} en curso, ${programados} programados)`);
  console.log(`  Trabajos realizados: ${TRABAJOS.length}`);
  console.log('\n  Credenciales: admin@galpon3.com / Admin1234!');
  console.log('  Flujo demo completo:');
  console.log('    Biolcati → BMW X5 AB123CD → Corrección pintura $320k → Finalizado + Trabajo');
  console.log('    Biolcati → Porsche Macan IJ789KL → Pintura total $1.45M → En curso (Plaza 1)');
  console.log('    Duggan   → Range Rover YZ890AB → Chapa trasera $980k → Finalizado + Trabajo');
  console.log('    Rocca    → Defender YZ901AB → Restauración $1.85M → En curso (Plaza 2)');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
