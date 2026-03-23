import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Truncate completo ────────────────────────────────────────────────────────

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

async function seedUsers() {
  console.log('\n--- Users ---');
  const pass = await bcrypt.hash('Admin1234!', 10);
  const users = [
    { email: 'admin@galpon3.com',    password: pass, nombre: 'Admin',    apellido: 'Galpón',   status: 'ACTIVO', privilege: 'A1' },
    { email: 'martin@galpon3.com',   password: pass, nombre: 'Martín',   apellido: 'Suárez',   status: 'ACTIVO', privilege: 'B1' },
    { email: 'lorena@galpon3.com',   password: pass, nombre: 'Lorena',   apellido: 'Vásquez',  status: 'ACTIVO', privilege: 'B1' },
  ];
  for (const u of users) {
    await prisma.users.create({ data: u });
    console.log(`  [OK] ${u.email}`);
  }
  console.log('  Contraseña de todos: Admin1234!');
}

// ─── Clientes ─────────────────────────────────────────────────────────────────

const CLIENTES = [
  { apellido: 'Biolcati',         nombres: 'Alejandro Martín',  numeroDni: '20458912', numeroCuit: '20204589124', telefono: '1159234567', emailCliente: 'abiolcati@gmail.com',              dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Empresario',       domicilios: 'Av. del Libertador 2850, CABA' },
  { apellido: 'Urquiza',          nombres: 'Valentina Sofía',   numeroDni: '27834501', numeroCuit: '27278345018', telefono: '1145678923', emailCliente: 'vurquiza@estudio.com.ar',          dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Abogada',          domicilios: 'Coronel Díaz 1540, Palermo, CABA' },
  { apellido: 'Rocca',            nombres: 'Federico Andrés',   numeroDni: '31245678', numeroCuit: '20312456783', telefono: '1167894523', emailCliente: 'federico.rocca@clinicacentro.ar',  dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Médico cirujano',  domicilios: 'San Isidro, GBA Norte' },
  { apellido: 'Etchegoyen',       nombres: 'Mariana Belén',     numeroDni: '25678901', numeroCuit: '27256789015', telefono: '1178901234', emailCliente: 'm.etchegoyen@arq.com.ar',          dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Arquitecta',       domicilios: 'Posadas 1442, Recoleta, CABA' },
  { apellido: 'Llambías',         nombres: 'Ignacio Eduardo',   numeroDni: '28901234', numeroCuit: '20289012341', telefono: '2314567890', emailCliente: 'illambias@llambiasindustrias.com', dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Industrial',       domicilios: 'Manuel Alberti, Pilar' },
  { apellido: 'Pereyra Iraola',   nombres: 'Sofía Inés',        numeroDni: '33456789', numeroCuit: '27334567895', telefono: '1156789034', emailCliente: 'spereyra@fondocapital.com.ar',     dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Directora financiera', domicilios: 'Maipú 1290, Vicente López' },
  { apellido: 'Blaquier',         nombres: 'Rodrigo Facundo',   numeroDni: '29012345', numeroCuit: '20290123452', telefono: '1189012345', emailCliente: 'rblaquier@blaquierinv.com',        dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Inversor',         domicilios: 'Nordelta, Tigre' },
  { apellido: 'Aráoz',            nombres: 'Constanza Lucila',  numeroDni: '34567890', numeroCuit: '27345678903', telefono: '1101234567', emailCliente: 'caraoz@grupoaraoz.com.ar',         dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'CEO',              domicilios: 'Olivos, Vicente López' },
  { apellido: 'Duggan',           nombres: 'Martín Tomás',      numeroDni: '26789012', numeroCuit: '20267890123', telefono: '1112345678', emailCliente: 'martin.duggan@duggangroup.com',    dias: '30', provincia: 'Buenos Aires', sexo: 'Masculino', profesion: 'Empresario',       domicilios: 'La Horqueta, San Isidro' },
  { apellido: 'Zubizarreta',      nombres: 'Catalina Fernanda', numeroDni: '30123456', numeroCuit: '27301234564', telefono: '1134567890', emailCliente: 'czubizarreta@escribania.com.ar',   dias: '30', provincia: 'Buenos Aires', sexo: 'Femenino',  profesion: 'Escribana',        domicilios: 'Ocampo 525, Barrio Parque, CABA' },
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

// ─── Presupuestos ─────────────────────────────────────────────────────────────

const PRESUPUESTOS = [
  // Biolcati — BMW X5 (Finalizado + Pendiente)
  { key: 'X5-1',       patente: 'AB123CD', monto: '320000',  estado: 'Finalizado', tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección de swirls y rayaduras finas en toda la carrocería. Proceso de tres pasos con pulidora orbital. Acabado espejo.' },
  { key: 'X5-2',       patente: 'AB123CD', monto: '920000',  estado: 'Pendiente',  tipoTrabajo: 'PPF + cerámico',         observaciones: 'Aplicación de film protector PPF Xpel Ultimate Plus en zonas de impacto + sellado cerámico Gyeon Q2 completo.' },
  // Biolcati — Mercedes Clase E (Finalizado)
  { key: 'MBE-1',      patente: 'EF456GH', monto: '280000',  estado: 'Finalizado', tipoTrabajo: 'Detailing premium',      observaciones: 'Detailing show car completo: descontaminación química, corrección etapa 1, cera Concours de Carnauba. Interior tratado con cuero Colourlock.' },
  { key: 'MBE-2',      patente: 'EF456GH', monto: '680000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura capot y guardabarros delanteros por granizo. Pintura PPG bicapa código original Mercedes 197 Negro Obsidiana.' },
  // Biolcati — Porsche Macan (En curso)
  { key: 'MACAN-1',    patente: 'IJ789KL', monto: '1450000', estado: 'Aprobado',   tipoTrabajo: 'Pintura completa',       observaciones: 'Cambio de color completo de Blanco platino a Azul Gentian metalizado. Desmontaje total, imprimación epóxica, dos capas base y dos capas laca.' },
  // Urquiza — Audi Q7 (Finalizado)
  { key: 'Q7-1',       patente: 'MN012OP', monto: '480000',  estado: 'Finalizado', tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura puerta delantera izquierda y espejo retrovisor. Daño por roce en garaje. Color Audi código LZ9Y Negro Mythos perlado.' },
  { key: 'Q7-2',       patente: 'MN012OP', monto: '780000',  estado: 'Aprobado',   tipoTrabajo: 'Cerámico y PPF parcial', observaciones: 'Sellado cerámico Gtechniq Crystal Serum Ultra en carrocería completa. PPF en paragolpes delantero y espejo.' },
  // Urquiza — Volvo XC90 (En curso)
  { key: 'XC90-1',     patente: 'QR345ST', monto: '520000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura techo panorámico y pilares por oxidación superficial. Proceso de lijado fino, imprimación y laca Volvo código 717 Plateado.' },
  // Rocca — BMW Serie 5 (Finalizado)
  { key: 'BMW5-1',     patente: 'UV678WX', monto: '750000',  estado: 'Finalizado', tipoTrabajo: 'Chapa y pintura',        observaciones: 'Reparación lateral izquierdo completo por accidente: puerta delantera y trasera. Enderezado de chapa, masillado, imprimación y pintura BMW código 475 Gris Mineral.' },
  { key: 'BMW5-2',     patente: 'UV678WX', monto: '380000',  estado: 'Pendiente',  tipoTrabajo: 'Corrección y cerámico', observaciones: 'Post-reparación: corrección de pintura para nivelar diferencias de brillo + cerámico Carpro Cquartz Finest Reserve.' },
  // Rocca — Land Rover Defender (En curso — restauración)
  { key: 'DEFND-1',    patente: 'YZ901AB', monto: '1850000', estado: 'Aprobado',   tipoTrabajo: 'Restauración exterior',  observaciones: 'Restauración completa de carrocería: tratamiento anticorrosión, pintura completa en nuevo color Verde Pangaea, PPF en zonas bajas.' },
  // Rocca — Audi A5 (Programado)
  { key: 'A5-1',       patente: 'CD234EF', monto: '340000',  estado: 'Aprobado',   tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección de rayones superficiales y micro-rayaduras por lavado automático. Proceso de dos pasos, acabado showroom.' },
  // Etchegoyen — Mercedes GLE (Finalizado)
  { key: 'GLE-1',      patente: 'GH567IJ', monto: '350000',  estado: 'Finalizado', tipoTrabajo: 'Detailing premium',      observaciones: 'Detailing integral: decontaminación de barro de ruta, pulido en una etapa, sellado con cera Natural Wax Champion. Limpieza de llantas y frenos.' },
  { key: 'GLE-2',      patente: 'GH567IJ', monto: '560000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura paragolpe trasero y difusor por golpe en cochera. Mercedes código 149 Beige Arena perlado, dos capas base + barniz.' },
  // Etchegoyen — Land Cruiser Prado (Programado)
  { key: 'PRADO-1',    patente: 'KL890MN', monto: '620000',  estado: 'Aprobado',   tipoTrabajo: 'Chapa y pintura',        observaciones: 'Reparación lateral derecho completo: puerta trasera y aleta. Enderezado, masillado y pintura Toyota código 202 Negro Super White II.' },
  // Llambías — Lexus LX (Finalizado — PPF)
  { key: 'LX-1',       patente: 'OP123QR', monto: '720000',  estado: 'Finalizado', tipoTrabajo: 'PPF parcial',            observaciones: 'Aplicación de film PPF STEK DYNOshield en capot, guardabarros, retrovisores y espejo delantero. Protección mínima visible.' },
  { key: 'LX-2',       patente: 'OP123QR', monto: '280000',  estado: 'Pendiente',  tipoTrabajo: 'Detailing express',      observaciones: 'Pulido express y cerámico de mantenimiento Gtechniq EXOv5. Incluye limpieza de frenos y llantas de 24".' },
  // Llambías — Ford Ranger Raptor (Programado)
  { key: 'RAPTOR-1',   patente: 'ST456UV', monto: '780000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura completa',       observaciones: 'Cambio de color de Gris Eclipse a Negro Panther mate. Vinilo vinílico de alta calidad o pintura mate 3M, tratamiento UV.' },
  // Pereyra Iraola — Porsche Cayenne (En curso)
  { key: 'CAYEN-1',    patente: 'AB012CD', monto: '980000',  estado: 'Aprobado',   tipoTrabajo: 'PPF completo',           observaciones: 'PPF total carrocería con Xpel Ultimate Plus, incluyendo techo, pilares y umbrales. Garantía 10 años contra amarillamiento.' },
  // Pereyra Iraola — BMW 320i (Programado)
  { key: 'BMW3-1',     patente: 'EF345GH', monto: '360000',  estado: 'Aprobado',   tipoTrabajo: 'Corrección y PPF front', observaciones: 'Corrección de pintura en dos pasos + PPF frontal (capot, guardabarros, spoiler) Xpel Stealth acabado satinado.' },
  // Blaquier — Audi Q8 (En curso)
  { key: 'Q8-1',       patente: 'IJ678KL', monto: '460000',  estado: 'Aprobado',   tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección exhaustiva de tres etapas por rayones de lavadero. Finalizar con cerámico Carpro Cquartz UK 3.0.' },
  // Blaquier — AMG C63 (Programado)
  { key: 'AMG-1',      patente: 'MN901OP', monto: '320000',  estado: 'Aprobado',   tipoTrabajo: 'Detailing premium',      observaciones: 'Detailing show car: corrección, cera hand-applied Swissvax Crystal Rock. Interior: tratamiento de cuero y fibra de carbono.' },
  // Aráoz — Volvo XC60 (Finalizado)
  { key: 'XC60-1',     patente: 'QR234ST', monto: '260000',  estado: 'Finalizado', tipoTrabajo: 'Pulido y sellado',       observaciones: 'Pulido en una etapa para eliminar hazing post-invierno. Sellado con Gyeon Q2 Syncro, durabilidad 2 años.' },
  { key: 'XC60-2',     patente: 'QR234ST', monto: '540000',  estado: 'Pendiente',  tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura capot y aleta delantera derecha por impacto de piedra en ruta. Volvo código código 452 Azul Osmium metalizado.' },
  // Duggan — Range Rover Sport (Finalizado)
  { key: 'RRS-1',      patente: 'YZ890AB', monto: '980000',  estado: 'Finalizado', tipoTrabajo: 'Chapa y pintura',        observaciones: 'Reparación trasero completo por accidente: paragolpe, aleta y compuerta. Land Rover código 1AT Negro Santorini perlado. Cubierto por seguro SANCOR.' },
  // Duggan — Jaguar F-Pace (Programado)
  { key: 'FPACE-1',    patente: 'CD123EF', monto: '560000',  estado: 'Aprobado',   tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura capot y techo por granizo. Jaguar código 2202 Rojo Caldera metalizado, proceso en cabina de temperatura controlada.' },
  // Zubizarreta — Mercedes Clase C (Finalizado)
  { key: 'MBC-1',      patente: 'GH456IJ', monto: '420000',  estado: 'Finalizado', tipoTrabajo: 'Pintura parcial',        observaciones: 'Repintura puerta trasera derecha y aleta por roce en estacionamiento. Mercedes código 149 Blanco Polar, tricapa con efecto perla.' },
  // Zubizarreta — Lexus NX (Programado)
  { key: 'NX-1',       patente: 'KL789MN', monto: '520000',  estado: 'Aprobado',   tipoTrabajo: 'PPF + cerámico',         observaciones: 'Aplicación PPF Xpel en zonas de impacto y cerámico Gyeon Q2 completo. Protección total con garantía de instalación.' },
  // Zubizarreta — Audi Q5 (Pendiente)
  { key: 'Q5-1',       patente: 'OP012QR', monto: '350000',  estado: 'Pendiente',  tipoTrabajo: 'Corrección de pintura',  observaciones: 'Corrección de oxidación leve en techo y capot. Pre-inspección realizada, esperando aprobación del cliente.' },
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
  // Finalizados (histórico enero-marzo 2026)
  { key: 'T-X5-1',     presKey: 'X5-1',    plaza: 1, ini: '2026-01-08T08:00', fin: '2026-01-10T18:00', iniR: '2026-01-08T08:30', finR: '2026-01-10T17:00', estado: 'Finalizado', obs: 'Corrección completada. Se entregó con brillo espejo. Cliente muy conforme.' },
  { key: 'T-MBE-1',    presKey: 'MBE-1',   plaza: 2, ini: '2026-01-14T08:00', fin: '2026-01-15T18:00', iniR: '2026-01-14T09:00', finR: '2026-01-15T17:30', estado: 'Finalizado', obs: 'Detailing finalizado. Interior y exterior en condición showroom.' },
  { key: 'T-Q7-1',     presKey: 'Q7-1',    plaza: 3, ini: '2026-01-27T08:00', fin: '2026-01-29T18:00', iniR: '2026-01-27T08:00', finR: '2026-01-29T16:30', estado: 'Finalizado', obs: 'Repintura puerta izquierda. Match de color perfecto. Cliente retiró conforme.' },
  { key: 'T-BMW5-1',   presKey: 'BMW5-1',  plaza: 4, ini: '2026-02-03T08:00', fin: '2026-02-10T18:00', iniR: '2026-02-03T08:00', finR: '2026-02-10T17:00', estado: 'Finalizado', obs: 'Chapa lateral completa. Puertas reparadas y pintadas. Sin diferencia de color con el original.' },
  { key: 'T-GLE-1',    presKey: 'GLE-1',   plaza: 5, ini: '2026-02-17T09:00', fin: '2026-02-18T18:00', iniR: '2026-02-17T09:00', finR: '2026-02-18T16:00', estado: 'Finalizado', obs: 'Detailing express + tratamiento de cuero. Entrega en tiempo.' },
  { key: 'T-LX-1',     presKey: 'LX-1',    plaza: 6, ini: '2026-02-24T08:00', fin: '2026-02-26T18:00', iniR: '2026-02-24T08:00', finR: '2026-02-26T15:30', estado: 'Finalizado', obs: 'PPF instalado sin burbujas. Inspección bajo UV aprobada.' },
  { key: 'T-XC60-1',   presKey: 'XC60-1',  plaza: 1, ini: '2026-03-04T08:00', fin: '2026-03-04T18:00', iniR: '2026-03-04T08:30', finR: '2026-03-04T16:00', estado: 'Finalizado', obs: 'Pulido y sellado completado en jornada. Resultado excelente.' },
  { key: 'T-RRS-1',    presKey: 'RRS-1',   plaza: 2, ini: '2026-03-10T08:00', fin: '2026-03-17T18:00', iniR: '2026-03-10T08:00', finR: '2026-03-17T17:30', estado: 'Finalizado', obs: 'Reparación trasera completa cubierta por seguro SANCOR. Entrega total conformidad.' },
  { key: 'T-MBC-1',    presKey: 'MBC-1',   plaza: 3, ini: '2026-03-18T08:00', fin: '2026-03-19T18:00', iniR: '2026-03-18T09:00', finR: '2026-03-19T16:30', estado: 'Finalizado', obs: 'Puerta trasera y aleta pintadas. Pintura tricapa perfectamente nivelada.' },
  // En curso (semana corriente)
  { key: 'T-MACAN-1',  presKey: 'MACAN-1', plaza: 1, ini: '2026-03-20T08:00', fin: '2026-03-28T18:00', iniR: '2026-03-20T08:00', finR: null, estado: 'En curso', obs: 'Pintura total en proceso: desmontaje completo realizado, imprimación aplicada. Fase de base color iniciada.' },
  { key: 'T-DEFND-1',  presKey: 'DEFND-1', plaza: 2, ini: '2026-03-21T08:00', fin: '2026-04-04T18:00', iniR: '2026-03-21T08:00', finR: null, estado: 'En curso', obs: 'Restauración en proceso: tratamiento anticorrosión aplicado en pisos y umbrales. Pintura base en cabina.' },
  { key: 'T-XC90-1',   presKey: 'XC90-1',  plaza: 3, ini: '2026-03-21T09:00', fin: '2026-03-24T18:00', iniR: '2026-03-21T09:30', finR: null, estado: 'En curso', obs: 'Techo en preparación: lijado fino completado, primera capa de imprimación aplicada.' },
  { key: 'T-CAYEN-1',  presKey: 'CAYEN-1', plaza: 4, ini: '2026-03-22T08:00', fin: '2026-03-27T18:00', iniR: '2026-03-22T08:00', finR: null, estado: 'En curso', obs: 'PPF total Porsche: capot y guardabarros instalados. Faltan puertas, techos y paragolpes trasero.' },
  { key: 'T-Q8-1',     presKey: 'Q8-1',    plaza: 5, ini: '2026-03-22T08:00', fin: '2026-03-25T18:00', iniR: '2026-03-22T09:00', finR: null, estado: 'En curso', obs: 'Corrección tres pasos: etapas 1 y 2 finalizadas. Pendiente paso fino y aplicación de cerámico.' },
  // Programados (próximas semanas)
  { key: 'T-MBE-2',    presKey: 'MBE-2',   plaza: 6, ini: '2026-04-01T08:00', fin: '2026-04-04T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Repintura por granizo. Insumos PPG ordenados. Cliente confirmó por WhatsApp.' },
  { key: 'T-PRADO-1',  presKey: 'PRADO-1', plaza: 1, ini: '2026-04-07T08:00', fin: '2026-04-11T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Chapa lateral Prado. Presupuesto aprobado vía seguro La Segunda. Cita confirmada.' },
  { key: 'T-RAPTOR-1', presKey: 'RAPTOR-1',plaza: 2, ini: '2026-04-14T08:00', fin: '2026-04-22T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Cambio de color Ranger Raptor. Solicitar insumo negro mate 3M 1080-M12. Confirmar 48h antes.' },
  { key: 'T-BMW3-1',   presKey: 'BMW3-1',  plaza: 3, ini: '2026-04-23T08:00', fin: '2026-04-25T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Corrección + PPF frontal BMW 320i. Insumo Xpel en stock.' },
  { key: 'T-AMG-1',    presKey: 'AMG-1',   plaza: 4, ini: '2026-04-28T08:00', fin: '2026-04-29T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Detailing AMG C63. Cliente requiere entrega antes de evento automovilístico de mayo.' },
  { key: 'T-FPACE-1',  presKey: 'FPACE-1', plaza: 5, ini: '2026-05-05T08:00', fin: '2026-05-09T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Repintura Jaguar post-granizo. Perito de seguro autorizó el trabajo. Confirmar materiales.' },
  { key: 'T-NX-1',     presKey: 'NX-1',    plaza: 6, ini: '2026-05-12T08:00', fin: '2026-05-16T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'PPF + cerámico Lexus NX. Turno coordinado con la asistente de la clienta.' },
  { key: 'T-A5-1',     presKey: 'A5-1',    plaza: 1, ini: '2026-05-19T08:00', fin: '2026-05-21T18:00', iniR: null, finR: null, estado: 'Programado', obs: 'Corrección Audi A5. Confirmar con cliente Dr. Rocca disponibilidad del vehículo.' },
];

async function seedTurnos(presMap: Record<string, { id: number; uuid: string }>) {
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
    console.log(`  [OK] ${t.key} Plaza ${t.plaza} (${t.estado}) → id=${n.id}`);
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== SEED Galpón 3 Taller — Demo cliente ===');
  await truncateAll();
  await seedUsers();
  const clienteMap     = await seedClientes();
  const movilMap       = await seedMoviles(clienteMap);
  const presupuestoMap = await seedPresupuestos(movilMap);
  const turnoMap       = await seedTurnos(presupuestoMap);
  await seedTrabajosRealizados(turnoMap);

  const finalizados = TURNOS.filter(t => t.estado === 'Finalizado').length;
  const enCurso     = TURNOS.filter(t => t.estado === 'En curso').length;
  const programados = TURNOS.filter(t => t.estado === 'Programado').length;

  console.log('\n=== RESUMEN ===');
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
