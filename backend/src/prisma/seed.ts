import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash('admin123', 10);

  // Usuario con privilegio A1
  await prisma.users.upsert({
    where: { email: 'jonasans2@live.com.ar' },
    update: {},
    create: {
      email: 'jonasans2@live.com.ar',
      password: defaultPassword,
      name: 'Admin',
      privilege: 'A1',
      internosinvolucrado: null,
    },
  });

  // Usuario sin privilegio (solo puede eliminar lo que creó)
  await prisma.users.upsert({
    where: { email: 'jsanso407@gmail.com' },
    update: {},
    create: {
      email: 'jsanso407@gmail.com',
      password: defaultPassword,
      name: 'Usuario',
      privilege: null,
      internosinvolucrado: null,
    },
  });
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch((e) => {
    prisma.$disconnect();
    process.exit(1);
  });
