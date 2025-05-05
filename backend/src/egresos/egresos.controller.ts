// backend\src\egresos\egresos.controller.ts

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
import { EgresosService } from './egresos.service';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { UpdateEgresoDto } from './dto/update-egreso.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('egresos')
@Controller('egresos')
@UseInterceptors(ClassSerializerInterceptor)
export class EgresosController {
  constructor(private readonly egresosService: EgresosService) {}

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
  @ApiOperation({ summary: 'Create an egreso' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createEgresoDto: CreateEgresoDto,
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

          this.processFile(file, createEgresoDto, 'imagen-', 'imagen');
          this.processFile(file, createEgresoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createEgresoDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createEgresoDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createEgresoDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createEgresoDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createEgresoDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createEgresoDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createEgresoDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createEgresoDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createEgresoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createEgresoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createEgresoDto, 'word1-', 'word1', '.docx');
        });
      }

      return this.egresosService.create(createEgresoDto);
    } catch (error) {
      throw new HttpException(
        `Error processing request: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all egresos' })
  findAll() {
    return this.egresosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.egresosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateEgresoDto: UpdateEgresoDto,
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

      // Validar y procesar los archivos
      if (files && Array.isArray(files)) {
        console.log('[PATCH] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `File ${file.originalname} exceeds the size limit of 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }

          this.processFile(file, updateEgresoDto, 'imagen-', 'imagen');
          this.processFile(file, updateEgresoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateEgresoDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateEgresoDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateEgresoDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateEgresoDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateEgresoDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateEgresoDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateEgresoDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateEgresoDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateEgresoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateEgresoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateEgresoDto, 'word1-', 'word1', '.docx');
        });
      }

      return this.egresosService.update(id, updateEgresoDto);
    } catch (error) {
      throw new HttpException(
        `Error processing request: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.egresosService.remove(id);
  }
}
