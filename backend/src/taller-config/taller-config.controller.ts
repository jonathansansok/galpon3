// backend/src/taller-config/taller-config.controller.ts
import { Controller, Get, Patch, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import { TallerConfigService } from './taller-config.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { IsInt, Min, Max } from 'class-validator';

class UpdateTallerConfigDto {
  @IsInt() @Min(400) @Max(3000) canvasW: number;
  @IsInt() @Min(400) @Max(3000) canvasH: number;
}

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('taller-config')
@Controller('taller-config')
export class TallerConfigController {
  constructor(private readonly service: TallerConfigService) {}

  @Get()
  async get() {
    try {
      return await this.service.get();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch()
  async update(@Body() dto: UpdateTallerConfigDto, @Req() req: Request) {
    try {
      validateRequest(req);
      return await this.service.update(dto.canvasW, dto.canvasH);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
