//backend\src\piezas\piezas.controller.ts
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
} from '@nestjs/common';
import { PiezasService } from './piezas.service';
import { CreatePiezaDto } from './dto/create-pieza.dto';
import { UpdatePiezaDto } from './dto/update-pieza.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('piezas')
@Controller('piezas')
export class PiezasController {
  constructor(private readonly piezasService: PiezasService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Obtener todas las piezas' })
  async findAll() {
    try {
      return this.piezasService.findAll();
    } catch (error) {
      console.error('[piezas][GET] Error al obtener piezas:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una pieza por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.piezasService.findOne(id);
    } catch (error) {
      console.error('[piezas][GET] Error al obtener pieza:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear una pieza' })
  async create(@Body() createPiezaDto: CreatePiezaDto, @Req() req: Request) {
    try {
      console.log('[piezas][POST] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[piezas][POST] Token CSRF válido');
      console.log('[piezas][POST] Datos recibidos:', createPiezaDto);

      const result = await this.piezasService.create(createPiezaDto);
      return {
        message: 'Pieza creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[piezas][POST] Error al crear pieza:', error.message);
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
  @ApiOperation({ summary: 'Actualizar una pieza' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePiezaDto: UpdatePiezaDto,
    @Req() req: Request,
  ) {
    try {
      console.log('[piezas][PATCH] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[piezas][PATCH] Token CSRF válido');
      console.log('[piezas][PATCH] Datos recibidos:', { id, updatePiezaDto });

      const result = await this.piezasService.update(id, updatePiezaDto);
      return {
        message: 'Pieza actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[piezas][PATCH] Error al actualizar pieza:', error.message);
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
  @ApiOperation({ summary: 'Eliminar una pieza' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      console.log('[piezas][DELETE] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[piezas][DELETE] Token CSRF válido');
      return this.piezasService.remove(id);
    } catch (error) {
      console.error('[piezas][DELETE] Error al eliminar pieza:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
