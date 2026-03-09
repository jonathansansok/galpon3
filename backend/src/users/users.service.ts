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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(userId: number) {
    return this.prisma.users.delete({
      where: { id: userId },
    });
  }
}
