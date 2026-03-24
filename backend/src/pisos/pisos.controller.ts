// backend/src/pisos/pisos.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  ParseIntPipe, HttpException, HttpStatus, Req,
} from '@nestjs/common';
import { PisosService } from './pisos.service';
import { CreatePisoDto } from './dto/create-piso.dto';
import { UpdatePisoDto } from './dto/update-piso.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('pisos')
@Controller('pisos')
export class PisosController {
  constructor(private readonly pisosService: PisosService) {}

  @Get()
  async findAll() {
    try { return await this.pisosService.findAll(); }
    catch (e) { throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try { return await this.pisosService.findOne(id); }
    catch (e) { throw new HttpException(e.message, HttpStatus.NOT_FOUND); }
  }

  @Post()
  async create(@Body() dto: CreatePisoDto, @Req() req: Request) {
    try { validateRequest(req); return await this.pisosService.create(dto); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePisoDto, @Req() req: Request) {
    try { validateRequest(req); return await this.pisosService.update(id, dto); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try { validateRequest(req); return await this.pisosService.remove(id); }
    catch (e) { throw new HttpException(e.message, e.status ?? HttpStatus.BAD_REQUEST); }
  }
}
