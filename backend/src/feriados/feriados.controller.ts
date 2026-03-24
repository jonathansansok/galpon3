// backend/src/feriados/feriados.controller.ts
import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe,
  HttpException, HttpStatus, Req,
} from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('feriados')
@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Get()
  async findAll() {
    try { return await this.feriadosService.findAll(); }
    catch (e) { throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post()
  async create(@Body() dto: CreateFeriadoDto, @Req() req: Request) {
    try { validateRequest(req); return await this.feriadosService.create(dto); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try { validateRequest(req); return await this.feriadosService.remove(id); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }
}
