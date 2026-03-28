// backend/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    console.log('[USERS] [FIND BY EMAIL] email:', email);
    const result = await this.prisma.users.findUnique({ where: { email } });
    console.log('[USERS] [FIND BY EMAIL]', result ? `encontrado id:${result.id}` : 'no encontrado');
    return result;
  }

  async findById(id: number) {
    console.log('[USERS] [FIND BY ID] id:', id);
    const result = await this.prisma.users.findUnique({ where: { id } });
    console.log('[USERS] [FIND BY ID]', result ? `encontrado email:${result.email}` : 'no encontrado');
    return result;
  }

  async createUser(data: {
    email: string;
    password: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
  }) {
    console.log('[USERS] [CREATE] email:', data.email, 'nombre:', data.nombre, 'apellido:', data.apellido);
    const result = await this.prisma.users.create({
      data: {
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
      },
    });
    console.log('[USERS] [CREATE] OK id:', result.id, 'email:', result.email);
    return result;
  }

  async updatePassword(userId: number, hashedPassword: string) {
    console.log('[USERS] [UPDATE PASSWORD] userId:', userId);
    const result = await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    console.log('[USERS] [UPDATE PASSWORD] OK userId:', userId);
    return result;
  }

  async setResetToken(userId: number, hashedToken: string, expiry: Date) {
    console.log('[USERS] [SET RESET TOKEN] userId:', userId, 'expiry:', expiry);
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });
  }

  async findReparadores() {
    console.log('[USERS] [FIND REPARADORES]');
    const result = await this.prisma.users.findMany({
      where: { privilege: { in: ['A1', 'B1'] } },
      select: { id: true, uuid: true, nombre: true, apellido: true, privilege: true },
      orderBy: { apellido: 'asc' },
    });
    console.log('[USERS] [FIND REPARADORES] Total:', result.length);
    return result;
  }

  async findByResetToken(hashedToken: string) {
    console.log('[USERS] [FIND BY RESET TOKEN]');
    return this.prisma.users.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });
  }

  async clearResetToken(userId: number) {
    console.log('[USERS] [CLEAR RESET TOKEN] userId:', userId);
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async findAdmins() {
    console.log('[USERS] [FIND ADMINS]');
    const result = await this.prisma.users.findMany({
      where: { privilege: 'A1' },
      select: { id: true, nombre: true, apellido: true, telefono: true },
      orderBy: { nombre: 'asc' },
    });
    console.log('[USERS] [FIND ADMINS] Total:', result.length);
    return result;
  }

  async findAll() {
    console.log('[USERS] [FIND ALL]');
    const result = await this.prisma.users.findMany({
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
    console.log('[USERS] [FIND ALL] Total:', result.length);
    return result;
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
    console.log('[USERS] [UPDATE] userId:', userId, 'campos:', Object.keys(data).join(', '));
    const result = await this.prisma.users.update({
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
    console.log('[USERS] [UPDATE] OK userId:', userId);
    return result;
  }

  async deleteUser(userId: number) {
    console.log('[USERS] [DELETE] userId:', userId);
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    const email = user?.email || 'desconocido';
    console.log('[USERS] [DELETE] email a eliminar:', email);

    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      select: { id: true, detail: true },
    });
    console.log('[USERS] [DELETE] logs a desasociar:', logs.length);
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

    const result = await this.prisma.users.delete({ where: { id: userId } });
    console.log('[USERS] [DELETE] OK email:', email);
    return result;
  }
}
