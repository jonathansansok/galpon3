// backend\src\elementos\elementos.controller.ts

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
import { ElementosService } from './elementos.service';
import { CreateElementoDto } from './dto/create-elemento.dto';
import { UpdateElementoDto } from './dto/update-elemento.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('elementos')
@Controller('elementos')
@UseInterceptors(ClassSerializerInterceptor)
export class ElementosController {
  constructor(private readonly elementosService: ElementosService) {}

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
  @ApiOperation({ summary: 'Create an elemento' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createElementoDto: CreateElementoDto,
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

          this.processFile(file, createElementoDto, 'imagen-', 'imagen');
          this.processFile(file, createElementoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createElementoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createElementoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createElementoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createElementoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createElementoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createElementoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createElementoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createElementoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createElementoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createElementoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createElementoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createElementoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createElementoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createElementoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createElementoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createElementoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createElementoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createElementoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createElementoDto, 'word1-', 'word1', '.docx');
        });
      }

      return this.elementosService.create(createElementoDto);
    } catch (error) {
      throw new HttpException(
        `Error processing request: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all elementos' })
  findAll() {
    return this.elementosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.elementosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateElementoDto: UpdateElementoDto,
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

          this.processFile(file, updateElementoDto, 'imagen-', 'imagen');
          this.processFile(file, updateElementoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateElementoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updateElementoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateElementoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateElementoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateElementoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateElementoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateElementoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateElementoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updateElementoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateElementoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateElementoDto, 'word1-', 'word1', '.docx');
        });
      }

      return this.elementosService.update(id, updateElementoDto);
    } catch (error) {
      throw new HttpException(
        `Error processing request: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.elementosService.remove(id);
  }
}
