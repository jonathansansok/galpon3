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
import { ExtramurosService } from './extramuros.service';
import { CreateExtramuroDto } from './dto/create-extramuro.dto';
import { UpdateExtramuroDto } from './dto/update-extramuro.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('extramuros')
@Controller('extramuros')
@UseInterceptors(ClassSerializerInterceptor)
export class ExtramurosController {
  constructor(private readonly extramurosService: ExtramurosService) {}

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
  @ApiOperation({ summary: 'Create an extramuros entry' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createExtramuroDto: CreateExtramuroDto,
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
          // Usar la función auxiliar para asignar archivos al DTO
          this.processFile(file, createExtramuroDto, 'imagen-', 'imagen');
          this.processFile(file, createExtramuroDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createExtramuroDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createExtramuroDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createExtramuroDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createExtramuroDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createExtramuroDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createExtramuroDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createExtramuroDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createExtramuroDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createExtramuroDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createExtramuroDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(
            file,
            createExtramuroDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.extramurosService.create(createExtramuroDto);
      return {
        message: 'Extramuros creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear extramuros:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all extramuros' })
  findAll() {
    return this.extramurosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.extramurosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateExtramuroDto: UpdateExtramuroDto,
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
          this.processFile(file, updateExtramuroDto, 'imagen-', 'imagen');
          this.processFile(file, updateExtramuroDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateExtramuroDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateExtramuroDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updateExtramuroDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateExtramuroDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(
            file,
            updateExtramuroDto,
            'word1-',
            'word1',
            '.docx',
          );
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.extramurosService.update(
        id,
        updateExtramuroDto,
      );
      return {
        message: 'Extramuros actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar extramuros:', error.message);
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

      const result = await this.extramurosService.remove(id);
      return {
        message: 'Extramuros eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar extramuros:', error.message);
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
