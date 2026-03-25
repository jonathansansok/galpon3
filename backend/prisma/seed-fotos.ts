// backend/prisma/seed-fotos.ts
// Puebla campo `imagen` de ingresos (clientes) y temas (móviles) con fotos
// de APIs públicas, subiéndolas a Cloudflare R2.
//
// Uso:
//   DATABASE_URL="..." R2_ACCOUNT_ID="..." R2_ACCESS_KEY_ID="..." \
//   R2_SECRET_ACCESS_KEY="..." R2_BUCKET_NAME="..." \
//   npx ts-node prisma/seed-fotos.ts

import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as https from 'https';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

// ─── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchBuffer(url: string, redirects = 8): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error('Too many redirects'));
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 galpon3-seed/1.0' } }, (res) => {
        if (
          (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) &&
          res.headers.location
        ) {
          // Resolver redirects relativos contra la URL base
          let next = res.headers.location;
          if (!next.startsWith('http')) {
            const base = new URL(url);
            next = new URL(next, `${base.protocol}//${base.host}`).toString();
          }
          return resolve(fetchBuffer(next, redirects - 1));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Upload ────────────────────────────────────────────────────────────────────

async function uploadToR2(buffer: Buffer, key: string) {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    }),
  );
}

function makeFilename() {
  return `imagen-${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`;
}

// ─── Fuentes de imágenes ──────────────────────────────────────────────────────

// randomuser.me sirve 70 retratos de hombres y 70 de mujeres (índices 1-70)
const usedPortraitIndexes = { men: new Set<number>(), women: new Set<number>() };

function nextPortraitIndex(pool: Set<number>): number {
  let n: number;
  do { n = Math.floor(Math.random() * 70) + 1; } while (pool.has(n) && pool.size < 70);
  pool.add(n);
  return n;
}

async function getPersonPhoto(sexo?: string | null): Promise<Buffer> {
  const isFemenino = sexo?.toLowerCase() === 'femenino';
  const gender = isFemenino ? 'women' : 'men';
  const pool = isFemenino ? usedPortraitIndexes.women : usedPortraitIndexes.men;
  const n = nextPortraitIndex(pool);
  const url = `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
  return fetchBuffer(url);
}

// loremflickr — fotos reales de autos desde Flickr
const usedCarSeeds = new Set<number>();

async function getCarPhoto(): Promise<Buffer> {
  let seed: number;
  do { seed = Math.floor(Math.random() * 5000) + 1; } while (usedCarSeeds.has(seed));
  usedCarSeeds.add(seed);
  const url = `https://loremflickr.com/800/600/car,automobile?lock=${seed}`;
  return fetchBuffer(url);
}

// ─── Seed clientes ─────────────────────────────────────────────────────────────

async function seedFotosClientes() {
  console.log('\n--- Fotos Clientes (ingresos) ---');
  const clientes = await prisma.ingresos.findMany({
    select: { id: true, apellido: true, nombres: true, sexo: true, imagen: true },
  });
  console.log(`  Encontrados: ${clientes.length} clientes`);

  for (const c of clientes) {
    if (c.imagen) { console.log(`  [SKIP] ${c.apellido} ya tiene foto`); continue; }
    try {
      const buffer = await getPersonPhoto(c.sexo);
      const filename = makeFilename();
      await uploadToR2(buffer, `ingresos/${filename}`);
      await prisma.ingresos.update({ where: { id: c.id }, data: { imagen: filename } });
      console.log(`  [OK] ${c.apellido}, ${c.nombres} → ${filename}`);
    } catch (e: any) {
      console.error(`  [ERR] ${c.apellido}: ${e.message}`);
    }
    await sleep(350);
  }
}

// ─── Seed móviles ──────────────────────────────────────────────────────────────

async function seedFotosMoviles() {
  console.log('\n--- Fotos Móviles (temas) ---');
  const moviles = await prisma.temas.findMany({
    select: { id: true, patente: true, marca: true, modelo: true, imagen: true },
  });
  console.log(`  Encontrados: ${moviles.length} móviles`);

  const forceMoviles = process.env.FORCE_MOVILES === 'true';

  for (const m of moviles) {
    if (m.imagen && !forceMoviles) { console.log(`  [SKIP] ${m.patente} ya tiene foto`); continue; }
    try {
      const buffer = await getCarPhoto();
      const filename = makeFilename();
      await uploadToR2(buffer, `temas/${filename}`);
      await prisma.temas.update({ where: { id: m.id }, data: { imagen: filename } });
      console.log(`  [OK] ${m.patente} ${m.marca} ${m.modelo} → ${filename}`);
    } catch (e: any) {
      console.error(`  [ERR] ${m.patente}: ${e.message}`);
    }
    await sleep(500);
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== SEED FOTOS — Galpón 3 ===');
  console.log(`  Bucket: ${BUCKET}`);

  await seedFotosClientes();
  await seedFotosMoviles();

  await prisma.$disconnect();
  console.log('\n=== DONE ===');
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
