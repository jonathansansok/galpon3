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
import { AgresionesService } from './agresiones.service';
import { CreateAgresionDto } from './dto/create-agresion.dto';
import { UpdateAgresionDto } from './dto/update-agresion.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('agresiones')
@Controller('agresiones')
@UseInterceptors(ClassSerializerInterceptor)
export class AgresionesController {
  constructor(private readonly agresionesService: AgresionesService) {}

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
  @ApiOperation({ summary: 'Create an agresion' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createAgresionDto: CreateAgresionDto,
    @Req() req: Request,
  ) {
    try {
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
        !createAgresionDto.internosinvolucrado ||
        createAgresionDto.internosinvolucrado === '[]'
      ) {
        createAgresionDto.internosinvolucrado = '[]'; // Asegurar que sea un JSON válido
      }
      if (files && Array.isArray(files)) {
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `File ${file.originalname} exceeds the size limit of 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, createAgresionDto, 'imagen-', 'imagen');
          this.processFile(file, createAgresionDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createAgresionDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            createAgresionDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            createAgresionDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            createAgresionDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            createAgresionDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            createAgresionDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            createAgresionDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            createAgresionDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, createAgresionDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createAgresionDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createAgresionDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.agresionesService.create(createAgresionDto);
      return {
        message: 'Agresión creada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear agresión:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all agresiones records' })
  findAll() {
    return this.agresionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agresionesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateAgresionDto: UpdateAgresionDto,
    @Req() req: Request,
  ) {
    try {
      validateRequest(req);
      console.log('Token CSRF válido');

      if (files && Array.isArray(files)) {
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `File ${file.originalname} exceeds the size limit of 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, updateAgresionDto, 'imagen-', 'imagen');
          this.processFile(file, updateAgresionDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateAgresionDto, 'imagenIz-', 'imagenIz');
          this.processFile(
            file,
            updateAgresionDto,
            'imagenDact-',
            'imagenDact',
          );
          this.processFile(
            file,
            updateAgresionDto,
            'imagenSen1-',
            'imagenSen1',
          );
          this.processFile(
            file,
            updateAgresionDto,
            'imagenSen2-',
            'imagenSen2',
          );
          this.processFile(
            file,
            updateAgresionDto,
            'imagenSen3-',
            'imagenSen3',
          );
          this.processFile(
            file,
            updateAgresionDto,
            'imagenSen4-',
            'imagenSen4',
          );
          this.processFile(
            file,
            updateAgresionDto,
            'imagenSen5-',
            'imagenSen5',
          );
          this.processFile(
            file,
            updateAgresionDto,
            'imagenSen6-',
            'imagenSen6',
          );
          this.processFile(file, updateAgresionDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateAgresionDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateAgresionDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.agresionesService.update(id, updateAgresionDto);
      return {
        message: 'Agresión actualizada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar agresión:', error.message);
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

      const result = await this.agresionesService.remove(id);
      return {
        message: 'Agresión eliminada exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar agresión:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Invalid CSRF token or other error',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
