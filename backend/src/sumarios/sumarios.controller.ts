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
import { SumariosService } from './sumarios.service';
import { CreateSumarioDto } from './dto/create-sumario.dto';
import { UpdateSumarioDto } from './dto/update-sumario.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('sumarios')
@Controller('sumarios')
@UseInterceptors(ClassSerializerInterceptor)
export class SumariosController {
  constructor(private readonly sumariosService: SumariosService) {}

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
  @ApiOperation({ summary: 'Create a sumario' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createSumarioDto: CreateSumarioDto,
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
          this.processFile(file, createSumarioDto, 'imagen-', 'imagen');
          this.processFile(file, createSumarioDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createSumarioDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createSumarioDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createSumarioDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createSumarioDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createSumarioDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createSumarioDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createSumarioDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createSumarioDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createSumarioDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createSumarioDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createSumarioDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.sumariosService.create(createSumarioDto);
      return {
        message: 'Sumario creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear sumario:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all sumarios' })
  findAll() {
    return this.sumariosService.findAll();
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

      return await this.sumariosService.findOne(id);
    } catch (error) {
      console.error(`Error al obtener sumario con id ${id}:`, error.message);
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
    @Body() updateSumarioDto: UpdateSumarioDto,
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
          this.processFile(file, updateSumarioDto, 'imagen-', 'imagen');
          this.processFile(file, updateSumarioDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateSumarioDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateSumarioDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateSumarioDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateSumarioDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateSumarioDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateSumarioDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateSumarioDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateSumarioDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateSumarioDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateSumarioDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateSumarioDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.sumariosService.update(id, updateSumarioDto);
      return {
        message: 'Sumario actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(`Error al actualizar sumario con id ${id}:`, error.message);
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

      const result = await this.sumariosService.remove(id);
      return {
        message: 'Sumario eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error(`Error al eliminar sumario con id ${id}:`, error.message);
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
