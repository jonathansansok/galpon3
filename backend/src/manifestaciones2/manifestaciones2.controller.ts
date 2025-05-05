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
import { Manifestaciones2Service } from './manifestaciones2.service';
import { CreateManifestacion2Dto } from './dto/create-manifestacion2.dto';
import { UpdateManifestacion2Dto } from './dto/update-manifestacion2.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('manifestaciones2')
@Controller('manifestaciones2')
@UseInterceptors(ClassSerializerInterceptor)
export class Manifestaciones2Controller {
  constructor(
    private readonly manifestaciones2Service: Manifestaciones2Service,
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
  @ApiOperation({ summary: 'Create a manifestacion2' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createManifestacion2Dto: CreateManifestacion2Dto,
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
          this.processFile(file, createManifestacion2Dto, 'imagen-', 'imagen');
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenIz-',
            'imagenIz',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf1-',
            'pdf1',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf2-',
            'pdf2',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf3-',
            'pdf3',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf4-',
            'pdf4',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf5-',
            'pdf5',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf6-',
            'pdf6',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf7-',
            'pdf7',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf8-',
            'pdf8',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf9-',
            'pdf9',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            createManifestacion2Dto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.manifestaciones2Service.create(
        createManifestacion2Dto,
      );
      return {
        message: 'Manifestación2 creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear manifestación2:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all manifestaciones2' })
  findAll() {
    return this.manifestaciones2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manifestaciones2Service.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateManifestacion2Dto: UpdateManifestacion2Dto,
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
          this.processFile(file, updateManifestacion2Dto, 'imagen-', 'imagen');
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenDer-',
            'imagenDer',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenIz-',
            'imagenIz',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf1-',
            'pdf1',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf2-',
            'pdf2',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf3-',
            'pdf3',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf4-',
            'pdf4',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf5-',
            'pdf5',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf6-',
            'pdf6',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf7-',
            'pdf7',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf8-',
            'pdf8',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf9-',
            'pdf9',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'pdf10-',
            'pdf10',
            '.pdf',
          );
          this.processFile(
            file,
            updateManifestacion2Dto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.manifestaciones2Service.update(
        id,
        updateManifestacion2Dto,
      );
      return {
        message: 'Manifestación2 actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar manifestación2:', error.message);
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

      const result = await this.manifestaciones2Service.remove(id);
      return {
        message: 'Manifestación2 eliminada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar manifestación2:', error.message);
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
