// backend\src\atentados\atentados.controller.ts
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
import { AtentadosService } from './atentados.service';
import { CreateAtentadoDto } from './dto/create-atentado.dto';
import { UpdateAtentadoDto } from './dto/update-atentado.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('atentados')
@Controller('atentados')
@UseInterceptors(ClassSerializerInterceptor)
export class AtentadosController {
  constructor(private readonly atentadosService: AtentadosService) {}

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
  @ApiOperation({ summary: 'Create an atentado' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createAtentadoDto: CreateAtentadoDto,
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
          this.processFile(file, createAtentadoDto, 'imagen-', 'imagen');
          this.processFile(file, createAtentadoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createAtentadoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createAtentadoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createAtentadoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createAtentadoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createAtentadoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createAtentadoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createAtentadoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createAtentadoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createAtentadoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createAtentadoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createAtentadoDto, 'word1-', 'word1', '.docx');
        });
      }

      return this.atentadosService.create(createAtentadoDto);
    } catch (error) {
      throw new HttpException(
        `Error processing request: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all atentados' })
  findAll() {
    return this.atentadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.atentadosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateAtentadoDto: UpdateAtentadoDto,
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
          // Usar la función auxiliar para asignar archivos al DTO
          this.processFile(file, updateAtentadoDto, 'imagen-', 'imagen');
          this.processFile(file, updateAtentadoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateAtentadoDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateAtentadoDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updateAtentadoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateAtentadoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateAtentadoDto, 'word1-', 'word1', '.docx');
        });
      }

      return this.atentadosService.update(id, updateAtentadoDto);
    } catch (error) {
      throw new HttpException(
        `Error processing request: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.atentadosService.remove(id);
  }
}
