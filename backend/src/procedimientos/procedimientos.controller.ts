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
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProcedimientosService } from './procedimientos.service';
import { CreateProcedimientoDto } from './dto/create-procedimiento.dto';
import { UpdateProcedimientoDto } from './dto/update-procedimiento.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('procedimientos')
@Controller('procedimientos')
@UseInterceptors(ClassSerializerInterceptor)
export class ProcedimientosController {
  constructor(private readonly procedimientosService: ProcedimientosService) {}

  // Función auxiliar para procesar archivos
  private processFile(
    file: Express.Multer.File,
    dto: any,
    prefix: string,
    key: string,
    extension: string = '.png',
  ) {
    if (file.originalname.startsWith(prefix)) {
      dto[key] = file.filename.replace(extname(file.filename), extension);
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Create a procedimiento' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProcedimientoDto: CreateProcedimientoDto,
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

      // Validar y procesar los archivos
      if (files && Array.isArray(files)) {
        console.log('[POST] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `File ${file.originalname} exceeds the size limit of 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, createProcedimientoDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenIz-',
            'imagenIz',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf1-',
            'pdf1',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf2-',
            'pdf2',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf3-',
            'pdf3',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf4-',
            'pdf4',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf5-',
            'pdf5',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf6-',
            'pdf6',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf7-',
            'pdf7',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf8-',
            'pdf8',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf9-',
            'pdf9',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            createProcedimientoDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.procedimientosService.create(
        createProcedimientoDto,
      );
      return {
        message: 'Procedimiento creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear procedimiento:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all procedimientos' })
  findAll() {
    return this.procedimientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.procedimientosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateProcedimientoDto: UpdateProcedimientoDto,
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

      // Procesar los archivos
      if (files && Array.isArray(files)) {
        console.log('[PATCH] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `File ${file.originalname} exceeds the size limit of 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, updateProcedimientoDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenIz-',
            'imagenIz',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf1-',
            'pdf1',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf2-',
            'pdf2',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf3-',
            'pdf3',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf4-',
            'pdf4',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf5-',
            'pdf5',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf6-',
            'pdf6',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf7-',
            'pdf7',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf8-',
            'pdf8',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf9-',
            'pdf9',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            updateProcedimientoDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.procedimientosService.update(
        id,
        updateProcedimientoDto,
      );
      return {
        message: 'Procedimiento actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar procedimiento:', error.message);
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

      const result = await this.procedimientosService.remove(id);
      return {
        message: 'Procedimiento eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar procedimiento:', error.message);
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
