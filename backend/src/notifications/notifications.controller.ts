import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.notificationsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 30,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async findRecent(@Query('since') since?: string) {
    return this.notificationsService.findRecent(since);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async unreadCount(@Request() req) {
    const count = await this.notificationsService.countUnread(req.user.userId);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mark-read')
  async markAsRead(@Request() req, @Body() body: { ids: number[] }) {
    return this.notificationsService.markAsRead(body.ids, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLog(
    @Request() req,
    @Body()
    body: {
      action: string;
      entity: string;
      entityId?: number;
      detail?: string;
    },
  ) {
    return this.notificationsService.create({
      action: body.action,
      entity: body.entity,
      entityId: body.entityId,
      detail: body.detail,
      userId: req.user.userId,
    });
  }
}
