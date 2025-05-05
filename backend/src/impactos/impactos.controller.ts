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
import { ImpactosService } from './impactos.service';
import { CreateImpactoDto } from './dto/create-impacto.dto';
import { UpdateImpactoDto } from './dto/update-impacto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('impactos')
@Controller('impactos')
@UseInterceptors(ClassSerializerInterceptor)
export class ImpactosController {
  constructor(private readonly impactosService: ImpactosService) {}

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
  @ApiOperation({ summary: 'Create an impacto' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createImpactoDto: CreateImpactoDto,
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
          this.processFile(file, createImpactoDto, 'imagen-', 'imagen');
          this.processFile(file, createImpactoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createImpactoDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createImpactoDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createImpactoDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createImpactoDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createImpactoDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createImpactoDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createImpactoDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createImpactoDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createImpactoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createImpactoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createImpactoDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.impactosService.create(createImpactoDto);
      return {
        message: 'Impacto creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear impacto:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all impactos' })
  findAll() {
    return this.impactosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.impactosService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateImpactoDto: UpdateImpactoDto,
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
          this.processFile(file, updateImpactoDto, 'imagen-', 'imagen');
          this.processFile(file, updateImpactoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateImpactoDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateImpactoDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateImpactoDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateImpactoDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateImpactoDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateImpactoDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateImpactoDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateImpactoDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateImpactoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateImpactoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateImpactoDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.impactosService.update(id, updateImpactoDto);
      return {
        message: 'Impacto actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar impacto:', error.message);
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

      const result = await this.impactosService.remove(id);
      return {
        message: 'Impacto eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar impacto:', error.message);
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
