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
import { AutosService } from './autos.service';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('autos')
@Controller('autos')
export class AutosController {
  constructor(private readonly autosService: AutosService) {}

  @Post()
  @ApiOperation({ summary: 'Create an auto' })
  async create(@Body() createAutoDto: CreateAutoDto, @Req() req: Request) {
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

      console.log('[POST] Datos recibidos para crear auto:', createAutoDto);

      const result = await this.autosService.create(createAutoDto);
      console.log('[POST] Auto creado con éxito:', result);

      return result;
    } catch (error) {
      console.error('[POST] Error al crear el auto:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all autos' })
  async findAll() {
    try {
      console.log('[GET] Solicitud para obtener todos los autos');
      const result = await this.autosService.findAll();
      console.log('[GET] Autos obtenidos con éxito:', result);
      return result;
    } catch (error) {
      console.error('[GET] Error al obtener los autos:', error.message);
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return a single auto' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log('[GET] Solicitud para obtener auto con ID:', id);
      const result = await this.autosService.findOne(id);
      console.log('[GET] Auto obtenido con éxito:', result);
      return result;
    } catch (error) {
      console.error(
        '[GET] Error al obtener el auto con ID:',
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
  @ApiOperation({ summary: 'Update an auto' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAutoDto: UpdateAutoDto,
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

      console.log('[PATCH] Datos recibidos para actualizar auto:', {
        id,
        updateAutoDto,
      });

      const result = await this.autosService.update(id, updateAutoDto);
      console.log('[PATCH] Auto actualizado con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[PATCH] Error al actualizar el auto con ID:',
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
  @ApiOperation({ summary: 'Delete an auto' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log('[DELETE] Solicitud para eliminar auto con ID:', id);

      const result = await this.autosService.remove(id);
      console.log('[DELETE] Auto eliminado con éxito:', result);

      return result;
    } catch (error) {
      console.error(
        '[DELETE] Error al eliminar el auto con ID:',
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
