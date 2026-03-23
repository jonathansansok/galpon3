import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@galpon3.com';
  const password = 'Admin1234!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.users.findFirst({ where: { email } });

  if (existing) {
    await prisma.users.update({
      where: { id: existing.id },
      data: { password: hashedPassword, status: 'ACTIVO', privilege: 'A1' },
    });
    console.log(`Usuario actualizado: ${email}`);
  } else {
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        nombre: 'Admin',
        apellido: 'Galpon',
        status: 'ACTIVO',
        privilege: 'A1',
      },
    });
    console.log(`Usuario creado: ${email}`);
  }

  console.log('Credenciales: admin@galpon3.com / Admin1234!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
