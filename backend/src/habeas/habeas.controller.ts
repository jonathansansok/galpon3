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
import { HabeasService } from './habeas.service';
import { CreateHabeaDto } from './dto/create-habea.dto';
import { UpdateHabeaDto } from './dto/update-habea.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('habeas')
@Controller('habeas')
@UseInterceptors(ClassSerializerInterceptor)
export class HabeasController {
  constructor(private readonly habeasService: HabeasService) {}

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
  @ApiOperation({ summary: 'Create a habeas record' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createHabeasDto: CreateHabeaDto,
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
          this.processFile(file, createHabeasDto, 'imagen-', 'imagen');
          this.processFile(file, createHabeasDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createHabeasDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createHabeasDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createHabeasDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createHabeasDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createHabeasDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createHabeasDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createHabeasDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createHabeasDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createHabeasDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createHabeasDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createHabeasDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.habeasService.create(createHabeasDto);
      return {
        message: 'Habeas creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear habeas:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all habeas records' })
  findAll() {
    return this.habeasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habeasService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateHabeasDto: UpdateHabeaDto,
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
          this.processFile(file, updateHabeasDto, 'imagen-', 'imagen');
          this.processFile(file, updateHabeasDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, updateHabeasDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, updateHabeasDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, updateHabeasDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, updateHabeasDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, updateHabeasDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, updateHabeasDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, updateHabeasDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, updateHabeasDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, updateHabeasDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, updateHabeasDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, updateHabeasDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[PATCH] No se recibieron archivos.');
      }

      const result = await this.habeasService.update(id, updateHabeasDto);
      return {
        message: 'Habeas actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar habeas:', error.message);
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

      const result = await this.habeasService.remove(id);
      return {
        message: 'Habeas eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar habeas:', error.message);
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
