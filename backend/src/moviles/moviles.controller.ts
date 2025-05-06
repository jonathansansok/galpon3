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
  Req,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MovilesService } from './moviles.service';
import { CreateMovilDto } from './dto/create-movil.dto';
import { UpdateMovilDto } from './dto/update-movil.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { extname } from 'path';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('moviles')
@Controller('moviles')
@UseInterceptors(ClassSerializerInterceptor)
export class MovilesController {
  constructor(private readonly movilesService: MovilesService) {}

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
  @ApiOperation({ summary: 'Crear un registro de móvil' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMovilDto: CreateMovilDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log(
        '[POST] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      validateRequest(req);
      console.log('Token CSRF válido');

      // Procesar archivos si existen
      if (files && Array.isArray(files)) {
        console.log('[POST] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `El archivo ${file.originalname} excede el límite de 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, createMovilDto, 'imagen-', 'imagen');
          this.processFile(file, createMovilDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createMovilDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createMovilDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createMovilDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createMovilDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createMovilDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createMovilDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createMovilDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createMovilDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createMovilDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createMovilDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createMovilDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createMovilDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createMovilDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createMovilDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createMovilDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createMovilDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createMovilDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createMovilDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createMovilDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.movilesService.create(createMovilDto);
      return {
        message: 'Móvil creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[POST] Error al crear móvil:', error.message);
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
  @ApiResponse({
    status: 200,
    description: 'Devuelve todos los registros de móviles',
  })
  findAll() {
    console.log('[GET] Obteniendo todos los móviles...');
    return this.movilesService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Devuelve un móvil por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(`[GET] Obteniendo móvil con ID ${id}...`);
    return this.movilesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Actualizar un registro de móvil' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateMovilDto: UpdateMovilDto,
    @Req() req: Request,
  ) {
    try {
      // Validar el token CSRF
      console.log(
        '[PATCH] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      validateRequest(req);
      console.log('Token CSRF válido');

      // Procesar archivos si existen
      if (files && Array.isArray(files)) {
        console.log('[PATCH] Archivos recibidos:', files);
        files.forEach((file) => {
          if (file.size > 4 * 1024 * 1024) {
            throw new HttpException(
              `El archivo ${file.originalname} excede el límite de 4MB`,
              HttpStatus.BAD_REQUEST,
            );
          }
          this.processFile(file, updateMovilDto, 'imagen-', 'imagen');
          this.processFile(file, updateMovilDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateMovilDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateMovilDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateMovilDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateMovilDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateMovilDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateMovilDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateMovilDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateMovilDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateMovilDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateMovilDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateMovilDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.movilesService.update(id, updateMovilDto);
      return {
        message: 'Móvil actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[PATCH] Error al actualizar móvil:', error.message);
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
  @ApiOperation({ summary: 'Eliminar un registro de móvil' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      // Validar el token CSRF
      console.log(
        '[DELETE] Token CSRF recibido en el encabezado:',
        req.headers['csrf-token'],
      );
      validateRequest(req);
      console.log('Token CSRF válido');

      const result = await this.movilesService.remove(id);
      return {
        message: 'Móvil eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('[DELETE] Error al eliminar móvil:', error.message);
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
