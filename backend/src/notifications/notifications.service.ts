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
    console.log('[NOTIFICATIONS] [CREATE] action:', data.action, 'entity:', data.entity, 'userId:', data.userId);
    const result = await this.prisma.auditLog.create({ data });
    console.log('[NOTIFICATIONS] [CREATE] OK id:', result.id);
    return result;
  }

  async findAll(page = 1, limit = 30) {
    console.log('[NOTIFICATIONS] [FIND ALL] page:', page, 'limit:', limit);
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
    console.log('[NOTIFICATIONS] [FIND ALL] Total:', total, 'página:', page);
    return { items, total, page, limit };
  }

  async findRecent(since?: string) {
    console.log('[NOTIFICATIONS] [FIND RECENT] since:', since ?? 'sin filtro');
    const where = since ? { createdAt: { gt: new Date(since) } } : {};
    const result = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { id: true, nombre: true, apellido: true, email: true } } },
    });
    console.log('[NOTIFICATIONS] [FIND RECENT] Total:', result.length);
    return result;
  }

  async countUnread(userId: number) {
    console.log('[NOTIFICATIONS] [COUNT UNREAD] userId:', userId);
    const all = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, readBy: true },
    });
    const count = all.filter((log) => {
      const readBy = (log.readBy as number[]) || [];
      return !readBy.includes(userId);
    }).length;
    console.log('[NOTIFICATIONS] [COUNT UNREAD] userId:', userId, 'no leídas:', count);
    return count;
  }

  async markAsRead(ids: number[], userId: number) {
    console.log('[NOTIFICATIONS] [MARK AS READ] ids:', ids, 'userId:', userId);
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
    console.log('[NOTIFICATIONS] [MARK AS READ] OK actualizados:', updates.length);
    return { success: true };
  }
}
