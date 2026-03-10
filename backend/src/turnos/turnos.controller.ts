//backend\src\turnos\turnos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('turnos')
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get('with-presupuesto-data/:id')
  @ApiOperation({ summary: 'Obtener un turno con datos de presupuesto y móvil' })
  async findOneWithPresupuestoData(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    try {
      console.log('[turnos][GET] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[turnos][GET] Token CSRF válido');
      return this.turnosService.findOneWithPresupuestoData(id);
    } catch (error) {
      console.error('[turnos][GET] Error al obtener turno con datos:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('with-presupuesto-data')
  @ApiOperation({ summary: 'Obtener turnos con datos de presupuesto y móvil' })
  async findAllWithPresupuestoData(@Req() req: Request) {
    try {
      console.log('[turnos][GET] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[turnos][GET] Token CSRF válido');
      return this.turnosService.findAllWithPresupuestoData();
    } catch (error) {
      console.error('[turnos][GET] Error al obtener turnos con datos:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('availability')
  @ApiOperation({ summary: 'Consultar disponibilidad de plazas por rango de fechas' })
  async getPlazaAvailability(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Req() req: Request,
  ) {
    try {
      console.log('[turnos][GET] Consultando disponibilidad:', { fechaInicio, fechaFin });
      validateRequest(req);
      console.log('[turnos][GET] Token CSRF válido');
      return this.turnosService.getPlazaAvailability(fechaInicio, fechaFin);
    } catch (error) {
      console.error('[turnos][GET] Error al consultar disponibilidad:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Obtener todos los turnos' })
  async findAll() {
    try {
      console.log('[turnos][GET] Solicitud para obtener todos los turnos');
      return this.turnosService.findAll();
    } catch (error) {
      console.error('[turnos][GET] Error al obtener turnos:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un turno por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      console.log('[turnos][GET] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[turnos][GET] Token CSRF válido');
      return this.turnosService.findOne(id);
    } catch (error) {
      console.error('[turnos][GET] Error al obtener turno:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear un turno' })
  async create(@Body() createTurnoDto: CreateTurnoDto, @Req() req: Request) {
    try {
      console.log('[turnos][POST] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[turnos][POST] Token CSRF válido');
      console.log('[turnos][POST] Datos recibidos:', createTurnoDto);

      const result = await this.turnosService.create(createTurnoDto);
      return {
        message: 'Turno creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[turnos][POST] Error al crear turno:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un turno' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnoDto: UpdateTurnoDto,
    @Req() req: Request,
  ) {
    try {
      console.log('[turnos][PATCH] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[turnos][PATCH] Token CSRF válido');
      console.log('[turnos][PATCH] Datos recibidos:', { id, updateTurnoDto });

      const result = await this.turnosService.update(id, updateTurnoDto);
      return {
        message: 'Turno actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[turnos][PATCH] Error al actualizar turno:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un turno' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      console.log('[turnos][DELETE] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[turnos][DELETE] Token CSRF válido');
      return this.turnosService.remove(id);
    } catch (error) {
      console.error('[turnos][DELETE] Error al eliminar turno:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
