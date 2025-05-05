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
import { ReqnosService } from './reqnos.service';
import { CreateReqnoDto } from './dto/create-reqno.dto';
import { UpdateReqnoDto } from './dto/update-reqno.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('reqnos')
@Controller('reqnos')
@UseInterceptors(ClassSerializerInterceptor)
export class ReqnosController {
  constructor(private readonly reqnosService: ReqnosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a reqno' })
  async create(@Body() createReqnoDto: CreateReqnoDto, @Req() req: Request) {
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

      const result = await this.reqnosService.create(createReqnoDto);
      return {
        message: 'Reqno creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear reqno:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all reqnos' })
  findAll() {
    return this.reqnosService.findAll();
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

      return await this.reqnosService.findOne(id);
    } catch (error) {
      console.error(`Error al obtener reqno con id ${id}:`, error.message);
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
    @Body() updateReqnoDto: UpdateReqnoDto,
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

      const result = await this.reqnosService.update(id, updateReqnoDto);
      return {
        message: 'Reqno actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(`Error al actualizar reqno con id ${id}:`, error.message);
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

      const result = await this.reqnosService.remove(id);
      return {
        message: 'Reqno eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(`Error al eliminar reqno con id ${id}:`, error.message);
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
