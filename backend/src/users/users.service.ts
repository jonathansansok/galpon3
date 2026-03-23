// backend/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
  }) {
    console.log('[UsersService] createUser data:', JSON.stringify({ email: data.email, nombre: data.nombre, apellido: data.apellido, telefono: data.telefono }));
    return this.prisma.users.create({
      data: {
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
      },
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async setResetToken(userId: number, hashedToken: string, expiry: Date) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });
  }

  async findByResetToken(hashedToken: string) {
    return this.prisma.users.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });
  }

  async clearResetToken(userId: number) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async findAdmins() {
    return this.prisma.users.findMany({
      where: { privilege: 'A1' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        privilege: true,
        comp: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async updateUser(
    userId: number,
    data: {
      nombre?: string;
      apellido?: string;
      telefono?: string;
      email?: string;
      privilege?: string;
      comp?: string;
      status?: string;
    },
  ) {
    return this.prisma.users.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        privilege: true,
        comp: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    const email = user?.email || 'desconocido';

    // Estampar email en el detalle de cada log antes de desasociar
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      select: { id: true, detail: true },
    });
    await Promise.all(
      logs.map((log) =>
        this.prisma.auditLog.update({
          where: { id: log.id },
          data: {
            detail: log.detail
              ? `[${email}] ${log.detail}`
              : `[${email}]`,
            user: { disconnect: true },
          },
        }),
      ),
    );

    return this.prisma.users.delete({
      where: { id: userId },
    });
  }
}
