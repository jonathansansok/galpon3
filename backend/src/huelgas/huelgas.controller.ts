//backend\src\huelgas\huelgas.controller.ts
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
import { HuelgasService } from './huelgas.service';
import { CreateHuelgaDto } from './dto/create-huelga.dto';
import { UpdateHuelgaDto } from './dto/update-huelga.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('huelgas')
@Controller('huelgas')
@UseInterceptors(ClassSerializerInterceptor)
export class HuelgasController {
  constructor(private readonly huelgasService: HuelgasService) {}

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
  @ApiOperation({ summary: 'Create a huelga' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createHuelgaDto: CreateHuelgaDto,
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
          this.processFile(file, createHuelgaDto, 'imagen-', 'imagen');
          this.processFile(file, createHuelgaDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createHuelgaDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createHuelgaDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createHuelgaDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createHuelgaDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createHuelgaDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createHuelgaDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createHuelgaDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createHuelgaDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createHuelgaDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createHuelgaDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createHuelgaDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.huelgasService.create(createHuelgaDto);
      return {
        message: 'Huelga creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear huelga:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all huelgas' })
  findAll() {
    return this.huelgasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.huelgasService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateHuelgaDto: UpdateHuelgaDto,
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
          this.processFile(file, updateHuelgaDto, 'imagen-', 'imagen');
          this.processFile(file, updateHuelgaDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateHuelgaDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateHuelgaDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateHuelgaDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateHuelgaDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateHuelgaDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateHuelgaDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateHuelgaDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateHuelgaDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateHuelgaDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateHuelgaDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateHuelgaDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.huelgasService.update(id, updateHuelgaDto);
      return {
        message: 'Huelga actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar huelga:', error.message);
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

      const result = await this.huelgasService.remove(id);
      return {
        message: 'Huelga eliminada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar huelga:', error.message);
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
