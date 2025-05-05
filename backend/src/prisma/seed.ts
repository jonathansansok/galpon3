import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuario con privilegio A1
  await prisma.users.upsert({
    where: { email: 'jonasans2@live.com.ar' },
    update: {},
    create: {
      email: 'jonasans2@live.com.ar',
      privilege: 'A1', // Puede hacer de todo
      internosinvolucrado: null,
    },
  });

  // Usuario sin privilegio (solo puede eliminar lo que creó)
  await prisma.users.upsert({
    where: { email: 'jsanso407@gmail.com' },
    update: {},
    create: {
      email: 'jsanso407@gmail.com',
      privilege: null, // Sin privilegios especiales
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
