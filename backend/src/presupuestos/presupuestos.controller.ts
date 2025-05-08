import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('presupuestos')
@Controller('presupuestos')
export class PresupuestosController {
  constructor(private readonly presupuestosService: PresupuestosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un presupuesto' })
  async create(
    @Body() createPresupuestoDto: CreatePresupuestoDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log('[POST] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[POST] Token CSRF válido');

      return this.presupuestosService.create(createPresupuestoDto);
    } catch (error) {
      console.error('[POST] Error al crear presupuesto:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Obtener todos los presupuestos' })
  async findAll(@Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log('[GET] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[GET] Token CSRF válido');

      return this.presupuestosService.findAll();
    } catch (error) {
      console.error('[GET] Error al obtener presupuestos:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un presupuesto por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log('[GET] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[GET] Token CSRF válido');

      return this.presupuestosService.findOne(id);
    } catch (error) {
      console.error('[GET] Error al obtener presupuesto:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un presupuesto' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log('[PATCH] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[PATCH] Token CSRF válido');

      return this.presupuestosService.update(id, updatePresupuestoDto);
    } catch (error) {
      console.error('[PATCH] Error al actualizar presupuesto:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar completamente un presupuesto' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log('[PUT] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[PUT] Token CSRF válido');

      return this.presupuestosService.update(id, updatePresupuestoDto);
    } catch (error) {
      console.error('[PUT] Error al reemplazar presupuesto:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un presupuesto' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log('[DELETE] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[DELETE] Token CSRF válido');

      return this.presupuestosService.remove(id);
    } catch (error) {
      console.error('[DELETE] Error al eliminar presupuesto:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
