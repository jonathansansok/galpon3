// backend\src\rexternos\reqexts.controller.ts
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
import { ReqextsService } from './reqexts.service';
import { CreateReqextDto } from './dto/create-reqext.dto';
import { UpdateReqextDto } from './dto/update-reqext.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('reqexts')
@Controller('reqexts')
@UseInterceptors(ClassSerializerInterceptor)
export class ReqextsController {
  constructor(private readonly reqextsService: ReqextsService) {}

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
  @ApiOperation({ summary: 'Create a reqext' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createReqextDto: CreateReqextDto,
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
          this.processFile(file, createReqextDto, 'imagen-', 'imagen');
          this.processFile(file, createReqextDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createReqextDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createReqextDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createReqextDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createReqextDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createReqextDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createReqextDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createReqextDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createReqextDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createReqextDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createReqextDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createReqextDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createReqextDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createReqextDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createReqextDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createReqextDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createReqextDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createReqextDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createReqextDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createReqextDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.reqextsService.create(createReqextDto);
      return {
        message: 'Reqext creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear reqext:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all reqexts' })
  findAll() {
    return this.reqextsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reqextsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateReqextDto: UpdateReqextDto,
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
          this.processFile(file, updateReqextDto, 'imagen-', 'imagen');
          this.processFile(file, updateReqextDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateReqextDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateReqextDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateReqextDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateReqextDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateReqextDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateReqextDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateReqextDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateReqextDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateReqextDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateReqextDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateReqextDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.reqextsService.update(id, updateReqextDto);
      return {
        message: 'Reqext actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar reqext:', error.message);
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

      const result = await this.reqextsService.remove(id);
      return {
        message: 'Reqext eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar reqext:', error.message);
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
