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
import { PrevencionesService } from './prevenciones.service';
import { CreatePrevencionDto } from './dto/create-prevencion.dto';
import { UpdatePrevencionDto } from './dto/update-prevencion.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('prevenciones')
@Controller('prevenciones')
@UseInterceptors(ClassSerializerInterceptor)
export class PrevencionesController {
  constructor(private readonly prevencionesService: PrevencionesService) {}

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
  @ApiOperation({ summary: 'Create a prevencion' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPrevencionDto: CreatePrevencionDto,
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
          this.processFile(file, createPrevencionDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            createPrevencionDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(file, createPrevencionDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createPrevencionDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createPrevencionDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createPrevencionDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(
            file,
            createPrevencionDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            createPrevencionDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.prevencionesService.create(createPrevencionDto);
      return {
        message: 'Prevención creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear prevención:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all prevenciones' })
  findAll() {
    return this.prevencionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prevencionesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updatePrevencionDto: UpdatePrevencionDto,
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
          this.processFile(file, updatePrevencionDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(file, updatePrevencionDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updatePrevencionDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updatePrevencionDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(
            file,
            updatePrevencionDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            updatePrevencionDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.prevencionesService.update(
        id,
        updatePrevencionDto,
      );
      return {
        message: 'Prevención actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar prevención:', error.message);
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

      const result = await this.prevencionesService.remove(id);
      return {
        message: 'Prevención eliminada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar prevención:', error.message);
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
