//backend\src\presupuestos\presupuestos.controller.ts
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
  UploadedFiles,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PresupuestosService } from './presupuestos.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { extname } from 'path';
import { Query } from '@nestjs/common';
const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('presupuestos')
@Controller('presupuestos')
export class PresupuestosController {
  constructor(private readonly presupuestosService: PresupuestosService) {}
  @Get('with-movil-data')
  @ApiOperation({ summary: 'Obtener presupuestos con datos de móviles' })
  async findAllWithMovilData(@Req() req: Request) {
    try {
      console.log('[GET] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[GET] Token CSRF válido');

      return this.presupuestosService.findAllWithMovilData();
    } catch (error) {
      console.error(
        '[GET] Error al obtener presupuestos con datos de móviles:',
        error.message,
      );
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('movil')
  @ApiOperation({ summary: 'Obtener presupuestos asociados a un movilId' })
  async findByMovilId(@Query('movilId') movilId: string, @Req() req: Request) {
    try {
      console.log(
        `[GET] Buscando presupuestos asociados al movilId: ${movilId}`,
      );
      validateRequest(req); // Validar el token CSRF
      console.log('[GET] Token CSRF válido');

      return this.presupuestosService.findByMovilId(movilId);
    } catch (error) {
      console.error(
        '[GET] Error al obtener presupuestos asociados:',
        error.message,
      );
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Función auxiliar para procesar archivos
  private processFile(
    file: Express.Multer.File,
    dto: any,
    prefix: string,
    key: string,
    extension: string = '.png',
  ) {
    if (file.originalname.startsWith(prefix)) {
      if (!file.filename) {
        throw new HttpException(
          `El archivo ${file.originalname} no tiene un nombre generado por Multer.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      dto[key] = file.filename.replace(extname(file.filename), extension);
    }
  }
  @Post()
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Crear un presupuesto con archivos multimedia' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPresupuestoDto: CreatePresupuestoDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log('[POST] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[POST] Token CSRF válido');

      // Validar y procesar los archivos
      if (files && Array.isArray(files)) {
        console.log('[POST] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `El archivo ${file.originalname} excede el límite de tamaño de 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          // Usar la función auxiliar para asignar archivos al DTO
          this.processFile(file, createPresupuestoDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(file, createPresupuestoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createPresupuestoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createPresupuestoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(
            file,
            createPresupuestoDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            createPresupuestoDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      // Crear el presupuesto usando el servicio
      const result =
        await this.presupuestosService.create(createPresupuestoDto);

      // Devolver un cuerpo en la respuesta
      return {
        message: 'Presupuesto creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[POST] Error al crear presupuesto:', error.message);
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
  @ApiResponse({ status: 200, description: 'Obtener todos los presupuestos' })
  async findAll(@Req() req: Request) {
    try {
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
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({
    summary: 'Actualizar un presupuesto con archivos multimedia',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
    @Req() req: Request,
  ) {
    try {
      console.log('[PATCH] Token CSRF recibido:', req.headers['csrf-token']);
      validateRequest(req);
      console.log('[PATCH] Token CSRF válido');

      // Procesar archivos multimedia
      if (files && Array.isArray(files)) {
        console.log('[PATCH] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `El archivo ${file.originalname} excede el límite de tamaño de 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, updatePresupuestoDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(file, updatePresupuestoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updatePresupuestoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updatePresupuestoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(
            file,
            updatePresupuestoDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            updatePresupuestoDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.presupuestosService.update(
        id,
        updatePresupuestoDto,
      );
      return {
        message: 'Presupuesto actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[PATCH] Error al actualizar presupuesto:', error.message);
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
