//backend\src\plazas\plazas.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  ParseIntPipe, HttpException, HttpStatus, Req, Query,
} from '@nestjs/common';
import { PlazasService } from './plazas.service';
import { CreatePlazaDto } from './dto/create-plaza.dto';
import { UpdatePlazaDto } from './dto/update-plaza.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('plazas')
@Controller('plazas')
export class PlazasController {
  constructor(private readonly plazasService: PlazasService) {}

  @Get()
  async findAll(@Query('pisoId') pisoId?: string) {
    try {
      const id = pisoId !== undefined ? parseInt(pisoId, 10) : undefined;
      return await this.plazasService.findAll(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/turnos-activos')
  async getTurnosActivos(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.plazasService.getTurnosActivos(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.plazasService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() dto: CreatePlazaDto, @Req() req: Request) {
    try {
      validateRequest(req);
      return await this.plazasService.create(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlazaDto,
    @Req() req: Request,
  ) {
    try {
      validateRequest(req);
      return await this.plazasService.update(id, dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('reasignarA') reasignarA: string,
    @Req() req: Request,
  ) {
    try {
      validateRequest(req);
      const reasignarANum = reasignarA ? parseInt(reasignarA, 10) : undefined;
      return await this.plazasService.remove(id, reasignarANum);
    } catch (error) {
      const status = error.status ?? HttpStatus.BAD_REQUEST;
      throw new HttpException(error.message, status);
    }
  }
}
