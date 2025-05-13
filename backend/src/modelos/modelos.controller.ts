//backend\src\modelos\modelos.controller.ts
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
import { ModelosService } from './modelos.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('modelos')
@Controller('modelos')
export class ModelosController {
  constructor(private readonly modelosService: ModelosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un modelo' })
  @ApiResponse({ status: 201, description: 'Modelo creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() createModeloDto: CreateModeloDto, @Req() req: Request) {
    try {
      validateRequest(req);
      console.log('[POST] Token CSRF válido');
      return await this.modelosService.create(createModeloDto);
    } catch (error) {
      console.error('[POST] Error al crear el modelo:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los modelos' })
  @ApiResponse({ status: 200, description: 'Modelos obtenidos con éxito.' })
  async findAll() {
    try {
      return await this.modelosService.findAll();
    } catch (error) {
      console.error('[GET] Error al obtener los modelos:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':marcaId')
  @ApiOperation({ summary: 'Obtener todos los modelos de una marca' })
  @ApiResponse({ status: 200, description: 'Modelos obtenidos con éxito.' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada.' })
  async findAllByMarca(@Param('marcaId', ParseIntPipe) marcaId: number) {
    try {
      return await this.modelosService.findAllByMarca(marcaId);
    } catch (error) {
      console.error('[GET] Error al obtener los modelos:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un modelo' })
  @ApiResponse({ status: 200, description: 'Modelo actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModeloDto: UpdateModeloDto,
    @Req() req: Request,
  ) {
    try {
      validateRequest(req);
      console.log('[PATCH] Token CSRF válido');
      return await this.modelosService.update(id, updateModeloDto);
    } catch (error) {
      console.error('[PATCH] Error al actualizar el modelo:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un modelo' })
  @ApiResponse({ status: 200, description: 'Modelo eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      validateRequest(req);
      console.log('[DELETE] Token CSRF válido');
      return await this.modelosService.remove(id);
    } catch (error) {
      console.error('[DELETE] Error al eliminar el modelo:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
