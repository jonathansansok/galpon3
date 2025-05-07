//backend\src\ingresos\ingresos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { validateRequest } = doubleCsrf({
  getSecret: (req) => req.cookies['csrf-secret'],
  cookieName: 'csrf-token',
  size: 64,
});

@ApiTags('ingresos')
@Controller('ingresos')
@UseInterceptors(ClassSerializerInterceptor)
export class IngresosController {
  constructor(private readonly ingresosService: IngresosService) {}

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
  @ApiOperation({ summary: 'Create an ingreso' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createIngresoDto: CreateIngresoDto,
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
          this.processFile(file, createIngresoDto, 'imagen-', 'imagen');
          this.processFile(file, createIngresoDto, 'imagenDer-', 'imagenDer');
          this.processFile(file, createIngresoDto, 'imagenIz-', 'imagenIz');
          this.processFile(file, createIngresoDto, 'imagenDact-', 'imagenDact');
          this.processFile(file, createIngresoDto, 'imagenSen1-', 'imagenSen1');
          this.processFile(file, createIngresoDto, 'imagenSen2-', 'imagenSen2');
          this.processFile(file, createIngresoDto, 'imagenSen3-', 'imagenSen3');
          this.processFile(file, createIngresoDto, 'imagenSen4-', 'imagenSen4');
          this.processFile(file, createIngresoDto, 'imagenSen5-', 'imagenSen5');
          this.processFile(file, createIngresoDto, 'imagenSen6-', 'imagenSen6');
          this.processFile(file, createIngresoDto, 'pdf1-', 'pdf1', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf2-', 'pdf2', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf3-', 'pdf3', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf4-', 'pdf4', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf5-', 'pdf5', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf6-', 'pdf6', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf7-', 'pdf7', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf8-', 'pdf8', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf9-', 'pdf9', '.pdf');
          this.processFile(file, createIngresoDto, 'pdf10-', 'pdf10', '.pdf');
          this.processFile(file, createIngresoDto, 'word1-', 'word1', '.docx');
        });
      } else {
        console.warn('[POST] No se recibieron archivos.');
      }

      const result = await this.ingresosService.create(createIngresoDto);
      return {
        message: 'Ingreso creado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al crear ingreso:', error.message);
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
  @ApiResponse({ status: 200, description: 'Return all ingresos' })
  findAll() {
    return this.ingresosService.findAll();
  }

  @Get('search')
  searchInternos(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }
    return this.ingresosService.searchInternos(query);
  }

  @Get('searchByLpu')
  async searchByLpu(@Query('lpuList') lpuList: string) {
    if (!lpuList) {
      throw new BadRequestException('Se requiere el parámetro lpuList');
    }

    const lpuArray = lpuList.split(',').map((lpu) => lpu.trim());
    if (lpuArray.some((lpu) => !/^\d+$/.test(lpu))) {
      throw new BadRequestException(
        'Todos los LPU deben ser cadenas numéricas',
      );
    }

    return this.ingresosService.searchByLpu(lpuArray);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 20))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateIngresoDto: UpdateIngresoDto,
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

      const result = await this.ingresosService.update(
        id,
        files,
        updateIngresoDto,
      );
      return {
        message: 'Ingreso actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar ingreso:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/historial/:egresoId')
  async updateFechaEgreso(
    @Param('id', ParseIntPipe) ingresoId: number,
    @Param('egresoId') egresoId: string,
    @Body('fechaEgreso') nuevaFechaEgreso: string,
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

      return this.ingresosService.updateFechaEgreso(
        ingresoId,
        egresoId,
        nuevaFechaEgreso,
      );
    } catch (error) {
      console.error('Error al actualizar fecha de egreso:', error.message);
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

      const result = await this.ingresosService.remove(id);
      return {
        message: 'Ingreso eliminado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al eliminar ingreso:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingresosService.findOne(id);
  }

  @Get(':evento/:lpu')
  findEventosByLpu(@Param('evento') evento: string, @Param('lpu') lpu: string) {
    return this.ingresosService.findEventosByLpu(evento, lpu);
  }
}
