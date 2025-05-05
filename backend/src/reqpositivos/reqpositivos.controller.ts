import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReqpositivosService } from './reqpositivos.service';
import { CreateReqpositivoDto } from './dto/create-reqpositivo.dto';
import { UpdateReqpositivoDto } from './dto/update-reqpositivo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('reqpositivos')
@Controller('reqpositivos')
@UseInterceptors(ClassSerializerInterceptor)
export class ReqpositivosController {
  constructor(private readonly reqpositivosService: ReqpositivosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a reqpositivo' })
  async create(
    @Body() createReqpositivoDto: CreateReqpositivoDto,
    @Req() req: Request,
  ) {
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
      console.log('Token CSRF válido');

      const result =
        await this.reqpositivosService.create(createReqpositivoDto);
      return {
        message: 'Reqpositivo creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear reqpositivo:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all reqpositivos' })
  findAll() {
    return this.reqpositivosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log(
        '[GET] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      console.log(
        '[GET] Token CSRF en las cookies:',
        req.cookies['csrf-token'],
      );

      validateRequest(req);
      console.log('Token CSRF válido');

      return await this.reqpositivosService.findOne(id);
    } catch (error) {
      console.error(
        `Error al obtener reqpositivo con id ${id}:`,
        error.message,
      );
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReqpositivoDto: UpdateReqpositivoDto,
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
      console.log('Token CSRF válido');

      const result = await this.reqpositivosService.update(
        id,
        updateReqpositivoDto,
      );
      return {
        message: 'Reqpositivo actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(
        `Error al actualizar reqpositivo con id ${id}:`,
        error.message,
      );
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
      console.log('Token CSRF válido');

      const result = await this.reqpositivosService.remove(id);
      return {
        message: 'Reqpositivo eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(
        `Error al eliminar reqpositivo con id ${id}:`,
        error.message,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
