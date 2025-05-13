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
  @ApiOperation({ summary: 'Create a modelo' })
  @ApiResponse({ status: 201, description: 'Modelo creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() createModeloDto: CreateModeloDto, @Req() req: Request) {
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

      console.log('[POST] Datos recibidos para crear modelo:', createModeloDto);

      const result = await this.modelosService.create(createModeloDto);
      console.log('[POST] Modelo creado con éxito:', result);

      return result;
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
      console.log('[GET] Solicitud para obtener todos los modelos');

      const result = await this.modelosService.findAll();
      console.log('[GET] Modelos obtenidos con éxito:', result);

      return result;
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
      console.log(
        '[GET] Solicitud para obtener modelos de la marca con ID:',
        marcaId,
      );

      const result = await this.modelosService.findAllByMarca(marcaId);
      console.log('[GET] Modelos obtenidos con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[GET] Error al obtener los modelos de la marca con ID:',
        marcaId,
        error.message,
      );
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a modelo' })
  @ApiResponse({ status: 200, description: 'Modelo actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModeloDto: UpdateModeloDto,
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

      console.log('[PATCH] Datos recibidos para actualizar modelo:', {
        id,
        updateModeloDto,
      });

      const result = await this.modelosService.update(id, updateModeloDto);
      console.log('[PATCH] Modelo actualizado con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[PATCH] Error al actualizar el modelo con ID:',
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
  @ApiOperation({ summary: 'Delete a modelo' })
  @ApiResponse({ status: 200, description: 'Modelo eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log(
        '[DELETE] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      console.log(
        '[DELETE] Token CSRF en las cookies:',
        req.cookies['csrf-token'],
      );

      validateRequest(req);
      console.log('[DELETE] Token CSRF válido');

      console.log('[DELETE] Solicitud para eliminar modelo con ID:', id);

      const result = await this.modelosService.remove(id);
      console.log('[DELETE] Modelo eliminado con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[DELETE] Error al eliminar el modelo con ID:',
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
