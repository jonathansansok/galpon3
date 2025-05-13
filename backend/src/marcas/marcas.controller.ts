//backend\src\marcas\marcas.controller.ts
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
import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marcas.dto';
import { UpdateMarcaDto } from './dto/update-marcas.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a marca' })
  async create(@Body() createMarcaDto: CreateMarcaDto, @Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log(
        '[POST] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      console.log(
        '[POST] Token CSRF en las cookies:',
        req.cookies['csrf-token'],
      );

      validateRequest(req);
      console.log('[POST] Token CSRF válido');

      console.log('[POST] Datos recibidos para crear marca:', createMarcaDto);

      const result = await this.marcasService.create(createMarcaDto);
      console.log('[POST] Marca creada con éxito:', result);

      return result;
    } catch (error) {
      console.error('[POST] Error al crear la marca:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all marcas' })
  async findAll() {
    try {
      console.log('[GET] Solicitud para obtener todas las marcas');
      const result = await this.marcasService.findAll();
      console.log('[GET] Marcas obtenidas con éxito:', result);
      return result;
    } catch (error) {
      console.error('[GET] Error al obtener las marcas:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return a single marca' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log('[GET] Solicitud para obtener marca con ID:', id);
      const result = await this.marcasService.findOne(id);
      console.log('[GET] Marca obtenida con éxito:', result);
      return result;
    } catch (error) {
      console.error(
        '[GET] Error al obtener la marca con ID:',
        id,
        error.message,
      );
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a marca' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log(
        '[PATCH] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      console.log(
        '[PATCH] Token CSRF en las cookies:',
        req.cookies['csrf-token'],
      );

      validateRequest(req);
      console.log('[PATCH] Token CSRF válido');

      console.log('[PATCH] Datos recibidos para actualizar marca:', {
        id,
        updateMarcaDto,
      });

      const result = await this.marcasService.update(id, updateMarcaDto);
      console.log('[PATCH] Marca actualizada con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[PATCH] Error al actualizar la marca con ID:',
        id,
        error.message,
      );
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a marca' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log('[DELETE] Solicitud para eliminar marca con ID:', id);

      const result = await this.marcasService.remove(id);
      console.log('[DELETE] Marca eliminada con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[DELETE] Error al eliminar la marca con ID:',
        id,
        error.message,
      );
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
