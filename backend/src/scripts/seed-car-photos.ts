// backend/src/scripts/seed-car-photos.ts
// Descarga fotos de autos desde LoremFlickr (CC, sin API key) y las sube a R2.
// Uso: cd backend && npx ts-node src/scripts/seed-car-photos.ts

import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
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
const R2_PUBLIC = process.env.R2_PUBLIC_URL || `https://pub-0bd8e4d879a54a60b29c7ffc695f395a.r2.dev`;

// Tags de LoremFlickr (fotos CC libres de Flickr) por marca
const BRAND_TAGS: Record<string, string> = {
  'BMW':         'bmw,car',
  'Mercedes':    'mercedes,car',
  'Porsche':     'porsche,car',
  'Audi':        'audi,car',
  'Volvo':       'volvo,car',
  'Land Rover':  'landrover,suv',
  'Toyota':      'toyota,car',
  'Ford':        'ford,truck',
  'Volkswagen':  'volkswagen,car',
  'Lexus':       'lexus,car',
  'Jaguar':      'jaguar,car',
};

const FALLBACK_TAG = 'sports,car';

// ─── HTTP fetch con seguimiento de redirects (LoremFlickr usa 302 → Flickr CDN) ─
function fetchBuffer(urlStr: string, remaining = 6): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const parsed = new URL(urlStr);
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.get(urlStr, { timeout: 12000 }, (res) => {
      const { statusCode, headers } = res;
      if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location && remaining > 0) {
        const next = headers.location.startsWith('http')
          ? headers.location
          : `${parsed.origin}${headers.location}`;
        fetchBuffer(next, remaining - 1).then(resolve);
        res.resume();
        return;
      }
      if (!statusCode || statusCode >= 400) {
        console.log(`    ⚠️  HTTP ${statusCode}`);
        res.resume();
        resolve(null);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', (e) => { console.log(`    ⚠️  ${e.message}`); resolve(null); });
    req.on('timeout', () => { req.destroy(); console.log('    ⚠️  timeout'); resolve(null); });
  });
}

async function uploadR2(key: string, buf: Buffer): Promise<boolean> {
  try {
    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buf,
      ContentType: 'image/jpeg',
    }));
    return true;
  } catch (e: any) {
    console.log(`    ❌ R2 upload error: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🚗  Seed de fotos de móviles\n');

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
    console.error('❌ Variables R2 no encontradas en .env (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME)');
    process.exit(1);
  }

  const temas = await prisma.temas.findMany({
    select: { id: true, patente: true, marca: true },
    orderBy: { id: 'asc' },
  });

  if (!temas.length) {
    console.error('❌ Sin móviles en DB. Corré el seed primero: npx prisma db seed');
    return;
  }

  console.log(`📋 ${temas.length} móviles encontrados\n`);

  let ok = 0, fail = 0;

  for (let i = 0; i < temas.length; i++) {
    const { id, patente, marca } = temas[i];
    const tag = BRAND_TAGS[marca ?? ''] ?? FALLBACK_TAG;
    const lock = i + 1;
    const photoUrl = `https://loremflickr.com/800/533/${encodeURIComponent(tag)}?lock=${lock}`;
    const slug = (patente ?? `id${id}`).replace(/[^a-zA-Z0-9]/g, '');
    const filename = `foto-${slug}.jpg`;
    const r2Key = `temas/${filename}`;

    console.log(`[${String(i + 1).padStart(2)}/${temas.length}] ${marca ?? '?'} ${patente ?? '?'}`);
    console.log(`    🌐 ${photoUrl}`);

    const buf = await fetchBuffer(photoUrl);
    if (!buf || buf.length < 1000) { fail++; console.log('    ❌ Descarga fallida\n'); continue; }

    const uploaded = await uploadR2(r2Key, buf);
    if (!uploaded) { fail++; console.log('\n'); continue; }

    await prisma.temas.update({ where: { id }, data: { imagen: filename } });
    console.log(`    ✅ ${Math.round(buf.length / 1024)} KB → ${R2_PUBLIC}/temas/${filename}\n`);
    ok++;

    // pausa breve para no sobrecargar LoremFlickr
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\n──────────────────────────────────`);
  console.log(`✅ ${ok} fotos subidas   ❌ ${fail} fallaron`);
  console.log(`Las fotos se ven en TabMoviles → columna de imagen.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
