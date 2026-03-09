import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    action: string;
    entity: string;
    entityId?: number;
    entityUuid?: string;
    detail?: string;
    userId: number;
  }) {
    return this.prisma.auditLog.create({ data });
  }

  async findAll(page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, nombre: true, apellido: true, email: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);
    return { items, total, page, limit };
  }

  async findRecent(since?: string) {
    const where = since ? { createdAt: { gt: new Date(since) } } : {};
    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { id: true, nombre: true, apellido: true, email: true } } },
    });
  }

  async countUnread(userId: number) {
    // Count logs where userId is NOT in readBy array
    const all = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, readBy: true },
    });
    return all.filter((log) => {
      const readBy = (log.readBy as number[]) || [];
      return !readBy.includes(userId);
    }).length;
  }

  async markAsRead(ids: number[], userId: number) {
    // For each log, add userId to readBy if not already there
    const logs = await this.prisma.auditLog.findMany({
      where: { id: { in: ids } },
      select: { id: true, readBy: true },
    });

    const updates = logs.map((log) => {
      const readBy = (log.readBy as number[]) || [];
      if (!readBy.includes(userId)) {
        readBy.push(userId);
      }
      return this.prisma.auditLog.update({
        where: { id: log.id },
        data: { readBy },
      });
    });

    await Promise.all(updates);
    return { success: true };
  }
}
