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
import { PreingresosService } from './preingresos.service';
import { CreatePreingresoDto } from './dto/create-preingreso.dto';
import { UpdatePreingresoDto } from './dto/update-preingreso.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('preingresos')
@Controller('preingresos')
@UseInterceptors(ClassSerializerInterceptor)
export class PreingresosController {
  constructor(private readonly preingresosService: PreingresosService) {}

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
  @ApiOperation({ summary: 'Create a preingreso' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPreingresoDto: CreatePreingresoDto,
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
          this.processFile(file, createPreingresoDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            createPreingresoDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(file, createPreingresoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createPreingresoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createPreingresoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createPreingresoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(
            file,
            createPreingresoDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            createPreingresoDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.preingresosService.create(createPreingresoDto);
      return {
        message: 'Preingreso creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear preingreso:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all preingresos' })
  findAll() {
    return this.preingresosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preingresosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updatePreingresoDto: UpdatePreingresoDto,
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
          this.processFile(file, updatePreingresoDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(file, updatePreingresoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updatePreingresoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updatePreingresoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(
            file,
            updatePreingresoDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            updatePreingresoDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.preingresosService.update(
        id,
        updatePreingresoDto,
      );
      return {
        message: 'Preingreso actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar preingreso:', error.message);
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

      const result = await this.preingresosService.remove(id);
      return {
        message: 'Preingreso eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar preingreso:', error.message);
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
