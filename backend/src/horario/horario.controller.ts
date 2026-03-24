// backend/src/horario/horario.controller.ts
import {
  Controller, Get, Patch, Put, Body, Param, ParseIntPipe,
  HttpException, HttpStatus, Req,
} from '@nestjs/common';
import { HorarioService } from './horario.service';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('horario')
@Controller('horario')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

  @Get()
  async findAll() {
    try { return await this.horarioService.findAll(); }
    catch (e) { throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Patch(':diaSemana')
  async update(
    @Param('diaSemana', ParseIntPipe) diaSemana: number,
    @Body() dto: UpdateHorarioDto,
    @Req() req: Request,
  ) {
    try { validateRequest(req); return await this.horarioService.upsert(diaSemana, dto); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }

  @Put()
  async updateAll(@Body() body: { dias: UpdateHorarioDto[] }, @Req() req: Request) {
    try { validateRequest(req); return await this.horarioService.upsertMany(body.dias); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }
}
