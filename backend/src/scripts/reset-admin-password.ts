import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2] || 'admin123';

  const admin = await prisma.users.findFirst({
    where: { privilege: 'A1' },
  });

  if (!admin) {
    console.error('No se encontró usuario con privilege A1');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { id: admin.id },
    data: { password: hashedPassword },
  });

  console.log(`Contraseña actualizada para ${admin.email} (A1)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
