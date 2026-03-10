//backend\src\partes\partes.controller.ts
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
import { PartesService } from './partes.service';
import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('partes')
@Controller('partes')
export class PartesController {
  constructor(private readonly partesService: PartesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Obtener todas las partes' })
  async findAll() {
    try {
      return this.partesService.findAll();
    } catch (error) {
      console.error('[partes][GET] Error al obtener partes:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una parte por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.partesService.findOne(id);
    } catch (error) {
      console.error('[partes][GET] Error al obtener parte:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear una parte' })
  async create(@Body() createParteDto: CreateParteDto, @Req() req: Request) {
    try {
      console.log('[partes][POST] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[partes][POST] Token CSRF válido');
      console.log('[partes][POST] Datos recibidos:', createParteDto);

      const result = await this.partesService.create(createParteDto);
      return {
        message: 'Parte creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[partes][POST] Error al crear parte:', error.message);
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
  @ApiOperation({ summary: 'Actualizar una parte' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParteDto: UpdateParteDto,
    @Req() req: Request,
  ) {
    try {
      console.log('[partes][PATCH] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[partes][PATCH] Token CSRF válido');
      console.log('[partes][PATCH] Datos recibidos:', { id, updateParteDto });

      const result = await this.partesService.update(id, updateParteDto);
      return {
        message: 'Parte actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[partes][PATCH] Error al actualizar parte:', error.message);
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
  @ApiOperation({ summary: 'Eliminar una parte' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      console.log('[partes][DELETE] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[partes][DELETE] Token CSRF válido');
      return this.partesService.remove(id);
    } catch (error) {
      console.error('[partes][DELETE] Error al eliminar parte:', error.message);
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
