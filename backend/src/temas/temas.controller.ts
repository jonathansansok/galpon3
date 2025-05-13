//backend\src\temas\temas.controller.ts
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
import { TemasService } from './temas.service';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('temas')
@Controller('temas')
@UseInterceptors(ClassSerializerInterceptor)
export class TemasController {
  constructor(private readonly temasService: TemasService) {}

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
  @ApiOperation({ summary: 'Create a temas record' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createTemasDto: CreateTemaDto,
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

      // Validar y procesar internosinvolucrado
      if (
        !createTemasDto.internosinvolucrado ||
        createTemasDto.internosinvolucrado === '[]'
      ) {
        createTemasDto.internosinvolucrado = '[]'; // Asegurar que sea un JSON válido
      }

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
          this.processFile(file, createTemasDto, 'imagen-', 'imagen');
          this.processFile(file, createTemasDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createTemasDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createTemasDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createTemasDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createTemasDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createTemasDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createTemasDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createTemasDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createTemasDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createTemasDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createTemasDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createTemasDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createTemasDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createTemasDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createTemasDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createTemasDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createTemasDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createTemasDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createTemasDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createTemasDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      // Crear el tema usando el servicio
      const result = await this.temasService.create(createTemasDto);

      // Devolver un cuerpo en la respuesta
      return {
        message: 'Tema creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear tema desde serv:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all temas records' })
  findAll() {
    return this.temasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.temasService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateTemasDto: UpdateTemaDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      validateRequest(req);
      console.log('Token CSRF válido');

      // Procesar los archivos
      if (files && Array.isArray(files)) {
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `File ${file.originalname} exceeds the size limit of 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, updateTemasDto, 'imagen-', 'imagen');
          this.processFile(file, updateTemasDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateTemasDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateTemasDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateTemasDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateTemasDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateTemasDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateTemasDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateTemasDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateTemasDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateTemasDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateTemasDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateTemasDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.temasService.update(id, updateTemasDto);
      return {
        message: 'Tema actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar tema:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Invalid CSRF token or other error',
        HttpStatus.FORBIDDEN,
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

      const result = await this.temasService.remove(id);
      return {
        message: 'Tema eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar tema:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Invalid CSRF token or other error',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  @Get(':id/cliente')
  @ApiOperation({ summary: 'Obtener cliente asociado a un móvil' })
  async getClienteAsociado(@Param('id', ParseIntPipe) id: number) {
    return this.temasService.getClienteAsociado(id);
  }
}
