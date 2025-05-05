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
import { TrasladosService } from './traslados.service';
import { createTrasladoDto } from './dto/create-traslado.dto';
import { UpdateTrasladoDto } from './dto/update-traslado.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('traslados')
@Controller('traslados')
@UseInterceptors(ClassSerializerInterceptor)
export class TrasladosController {
  constructor(private readonly trasladosService: TrasladosService) {}

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
  @ApiOperation({ summary: 'Create a traslado' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createTrasladoDto: createTrasladoDto,
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
          this.processFile(file, createTrasladoDto, 'imagen-', 'imagen');
          this.processFile(file, createTrasladoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createTrasladoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createTrasladoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createTrasladoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createTrasladoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createTrasladoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createTrasladoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createTrasladoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createTrasladoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createTrasladoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createTrasladoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createTrasladoDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.trasladosService.create(createTrasladoDto);
      return {
        message: 'Traslado creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear traslado:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all traslados' })
  findAll() {
    return this.trasladosService.findAll();
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

      return await this.trasladosService.findOne(id);
    } catch (error) {
      console.error(`Error al obtener traslado con id ${id}:`, error.message);
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
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateTrasladoDto: UpdateTrasladoDto,
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
          this.processFile(file, updateTrasladoDto, 'imagen-', 'imagen');
          this.processFile(file, updateTrasladoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateTrasladoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateTrasladoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updateTrasladoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateTrasladoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateTrasladoDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.trasladosService.update(id, updateTrasladoDto);
      return {
        message: 'Traslado actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(
        `Error al actualizar traslado con id ${id}:`,
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

      const result = await this.trasladosService.remove(id);
      return {
        message: 'Traslado eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(`Error al eliminar traslado con id ${id}:`, error.message);
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
