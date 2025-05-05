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
import { ManifestacionesService } from './manifestaciones.service';
import { CreateManifestacionDto } from './dto/create-manifestacion.dto';
import { UpdateManifestacionDto } from './dto/update-manifestacion.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('manifestaciones')
@Controller('manifestaciones')
@UseInterceptors(ClassSerializerInterceptor)
export class ManifestacionesController {
  constructor(
    private readonly manifestacionesService: ManifestacionesService,
  ) {}

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
  @ApiOperation({ summary: 'Create a manifestacion' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createManifestacionDto: CreateManifestacionDto,
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
          this.processFile(file, createManifestacionDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            createManifestacionDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenIz-',
            'imagenIz',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf1-',
            'pdf1',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf2-',
            'pdf2',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf3-',
            'pdf3',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf4-',
            'pdf4',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf5-',
            'pdf5',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf6-',
            'pdf6',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf7-',
            'pdf7',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf8-',
            'pdf8',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf9-',
            'pdf9',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacionDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.manifestacionesService.create(
        createManifestacionDto,
      );
      return {
        message: 'Manifestación creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear manifestación:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all manifestaciones' })
  findAll() {
    return this.manifestacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manifestacionesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateManifestacionDto: UpdateManifestacionDto,
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
          this.processFile(file, updateManifestacionDto, 'imagen-', 'imagen');
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenIz-',
            'imagenIz',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf1-',
            'pdf1',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf2-',
            'pdf2',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf3-',
            'pdf3',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf4-',
            'pdf4',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf5-',
            'pdf5',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf6-',
            'pdf6',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf7-',
            'pdf7',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf8-',
            'pdf8',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf9-',
            'pdf9',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacionDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.manifestacionesService.update(
        id,
        updateManifestacionDto,
      );
      return {
        message: 'Manifestación actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar manifestación:', error.message);
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

      const result = await this.manifestacionesService.remove(id);
      return {
        message: 'Manifestación eliminada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar manifestación:', error.message);
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
