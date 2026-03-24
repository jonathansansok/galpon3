// backend/src/scripts/clean-turnos-seed-cyp.ts
// Uso: cd backend && npx ts-node src/scripts/clean-turnos-seed-cyp.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calcDiasPanosChapa(h: number): number {
  return Math.floor(h / 4) + (h % 4 >= 2 ? 0.5 : 0);
}

function cypJson(horasChapa: number, horasPintura: number): string {
  return JSON.stringify({
    chapa: {
      costo: 0,
      horas: horasChapa,
      diasPanos: calcDiasPanosChapa(horasChapa),
      materiales: '',
    },
    pintura: {
      costo: 0,
      horas: horasPintura,
      diasPanos: horasPintura / 6,
      materiales: '',
    },
  });
}

function horasDesde(monto: string | null): { chapa: number; pintura: number } {
  const m = parseFloat(monto ?? '0') || 0;
  if (m < 200000) return { chapa: 1,   pintura: 9  };
  if (m < 400000) return { chapa: 2,   pintura: 12 };
  if (m < 600000) return { chapa: 2.5, pintura: 18 };
  if (m < 900000) return { chapa: 4,   pintura: 21 };
  return                 { chapa: 6,   pintura: 24 };
}

async function main() {
  console.log('=== Limpieza de turnos y seed de preciosCyP ===\n');

  // 1. Borrar todos los turnos (TurnoReparadores se borra por cascade)
  const deleted = await prisma.turnos.deleteMany({});
  console.log(`✓ Turnos eliminados: ${deleted.count}`);

  await prisma.$executeRaw`ALTER TABLE Turnos AUTO_INCREMENT = 1`;
  console.log('✓ AUTO_INCREMENT de Turnos reseteado a 1\n');

  // 2. Actualizar presupuestos sin preciosCyP
  const sinCyp = await prisma.presupuestos.findMany({
    where: { preciosCyP: null },
    select: { id: true, monto: true, patente: true },
  });
  console.log(`Presupuestos sin preciosCyP: ${sinCyp.length}`);

  for (const p of sinCyp) {
    const { chapa, pintura } = horasDesde(p.monto);
    await prisma.presupuestos.update({
      where: { id: p.id },
      data: { preciosCyP: cypJson(chapa, pintura) },
    });
    console.log(`  → id=${p.id} patente=${p.patente ?? '?'} monto=${p.monto} → chapa ${chapa}h + pintura ${pintura}h`);
  }

  console.log(`\n✓ preciosCyP actualizado en ${sinCyp.length} presupuestos`);
  console.log('\n=== Listo ===');
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
