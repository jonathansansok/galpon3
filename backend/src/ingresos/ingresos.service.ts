//backend\src\ingresos\ingresos.service.ts
import { v4 as uuidv4 } from 'uuid'; // Importar para generar UUIDs

import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { extname } from 'path';

@Injectable()
export class IngresosService {
  constructor(private prismaService: PrismaService) {}
  async searchByLpu(lpuArray: string[]) {
    return this.prismaService.ingresos.findMany({
      where: {
        lpu: {
          in: lpuArray,
        },
      },
    });
  }
  async create(createIngresoDto: CreateIngresoDto) {
    try {
      return await this.prismaService.ingresos.create({
        data: createIngresoDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Ingreso with email ${createIngresoDto.email} already exists`,
          );
        }
      }

      throw new InternalServerErrorException(
        'Error en la creación del ingreso',
      );
    }
  }

  findAll() {
    return this.prismaService.ingresos.findMany();
  }
  async findOne(id: number) {
    console.log(`Buscando ingreso con id: ${id}`);
    const ingresoFound = await this.prismaService.ingresos.findUnique({
      where: {
        id: id,
      },
    });

    if (!ingresoFound) {
      console.log(`Ingreso con id ${id} no encontrado`);
      throw new NotFoundException(`Ingreso with id ${id} not found`);
    }

    console.log(`Ingreso encontrado:`, ingresoFound);
    return ingresoFound;
  }

  async update(
    id: number,
    files: Express.Multer.File[],
    updateIngresoDto: UpdateIngresoDto,
  ) {
    const existingIngreso = await this.findOne(id);

    // Manejar historial de egresos
    if (
      updateIngresoDto.condicion === 'Egresado' &&
      existingIngreso.condicion !== 'Egresado'
    ) {
      const historialEgresos = Array.isArray(existingIngreso.historialEgresos)
        ? existingIngreso.historialEgresos
        : [];

      historialEgresos.push(
        JSON.parse(
          JSON.stringify({
            fechaEgreso: new Date().toISOString(),
            datos: { ...updateIngresoDto },
          }),
        ),
      );
      updateIngresoDto.historialEgresos = historialEgresos;
    }

    // Procesar archivos subidos
    const imagenesHistorial: {
      imagen?: string[];
      imagenDer?: string[];
      imagenIz?: string[];
      imagenDact?: string[];
      imagenSen1?: string[];
      imagenSen2?: string[];
      imagenSen3?: string[];
      imagenSen4?: string[];
      imagenSen5?: string[];
      imagenSen6?: string[];
    } = (existingIngreso.imagenesHistorial as any) || {};

    files.forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        throw new HttpException(
          `File ${file.originalname} exceeds the size limit of 4MB`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (file.originalname.startsWith('imagen-')) {
        if (existingIngreso.imagen) {
          imagenesHistorial.imagen = imagenesHistorial.imagen || [];
          imagenesHistorial.imagen.push(existingIngreso.imagen);
        }
        updateIngresoDto.imagen = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenDer-')) {
        if (existingIngreso.imagenDer) {
          imagenesHistorial.imagenDer = imagenesHistorial.imagenDer || [];
          imagenesHistorial.imagenDer.push(existingIngreso.imagenDer);
        }
        updateIngresoDto.imagenDer = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenIz-')) {
        if (existingIngreso.imagenIz) {
          imagenesHistorial.imagenIz = imagenesHistorial.imagenIz || [];
          imagenesHistorial.imagenIz.push(existingIngreso.imagenIz);
        }
        updateIngresoDto.imagenIz = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenDact-')) {
        if (existingIngreso.imagenDact) {
          imagenesHistorial.imagenDact = imagenesHistorial.imagenDact || [];
          imagenesHistorial.imagenDact.push(existingIngreso.imagenDact);
        }
        updateIngresoDto.imagenDact = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenSen1-')) {
        if (existingIngreso.imagenSen1) {
          imagenesHistorial.imagenSen1 = imagenesHistorial.imagenSen1 || [];
          imagenesHistorial.imagenSen1.push(existingIngreso.imagenSen1);
        }
        updateIngresoDto.imagenSen1 = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenSen2-')) {
        if (existingIngreso.imagenSen2) {
          imagenesHistorial.imagenSen2 = imagenesHistorial.imagenSen2 || [];
          imagenesHistorial.imagenSen2.push(existingIngreso.imagenSen2);
        }
        updateIngresoDto.imagenSen2 = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenSen3-')) {
        if (existingIngreso.imagenSen3) {
          imagenesHistorial.imagenSen3 = imagenesHistorial.imagenSen3 || [];
          imagenesHistorial.imagenSen3.push(existingIngreso.imagenSen3);
        }
        updateIngresoDto.imagenSen3 = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenSen4-')) {
        if (existingIngreso.imagenSen4) {
          imagenesHistorial.imagenSen4 = imagenesHistorial.imagenSen4 || [];
          imagenesHistorial.imagenSen4.push(existingIngreso.imagenSen4);
        }
        updateIngresoDto.imagenSen4 = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenSen5-')) {
        if (existingIngreso.imagenSen5) {
          imagenesHistorial.imagenSen5 = imagenesHistorial.imagenSen5 || [];
          imagenesHistorial.imagenSen5.push(existingIngreso.imagenSen5);
        }
        updateIngresoDto.imagenSen5 = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('imagenSen6-')) {
        if (existingIngreso.imagenSen6) {
          imagenesHistorial.imagenSen6 = imagenesHistorial.imagenSen6 || [];
          imagenesHistorial.imagenSen6.push(existingIngreso.imagenSen6);
        }
        updateIngresoDto.imagenSen6 = file.filename.replace(
          extname(file.filename),
          '.png',
        );
      } else if (file.originalname.startsWith('pdf1-')) {
        updateIngresoDto.pdf1 = file.filename;
      } else if (file.originalname.startsWith('pdf2-')) {
        updateIngresoDto.pdf2 = file.filename;
      } else if (file.originalname.startsWith('pdf3-')) {
        updateIngresoDto.pdf3 = file.filename;
      } else if (file.originalname.startsWith('pdf4-')) {
        updateIngresoDto.pdf4 = file.filename;
      } else if (file.originalname.startsWith('pdf5-')) {
        updateIngresoDto.pdf5 = file.filename;
      } else if (file.originalname.startsWith('pdf6-')) {
        updateIngresoDto.pdf6 = file.filename;
      } else if (file.originalname.startsWith('pdf7-')) {
        updateIngresoDto.pdf7 = file.filename;
      } else if (file.originalname.startsWith('pdf8-')) {
        updateIngresoDto.pdf8 = file.filename;
      } else if (file.originalname.startsWith('pdf9-')) {
        updateIngresoDto.pdf9 = file.filename;
      } else if (file.originalname.startsWith('pdf10-')) {
        updateIngresoDto.pdf10 = file.filename;
      } else if (file.originalname.startsWith('word1-')) {
        updateIngresoDto.word1 = file.filename;
      }
    });

    updateIngresoDto.imagenesHistorial = imagenesHistorial;

    return this.prismaService.ingresos.update({
      where: { id },
      data: updateIngresoDto,
    });
  }

  async remove(id: number) {
    const deletedIngreso = await this.prismaService.ingresos.delete({
      where: {
        id,
      },
    });

    if (!deletedIngreso) {
      throw new NotFoundException(`Ingreso with id ${id} not found`);
    }

    return deletedIngreso;
  }

  async findEventosByLpu(evento: string, lpu: string) {
    const eventos = await this.prismaService[evento].findMany({
      where: {
        internosinvolucrado: {
          contains: `"lpu":"${lpu}"`,
        },
      },
    });

    return eventos;
  }

  async searchInternos(query: string) {
    return this.prismaService.ingresos.findMany({
      where: {
        OR: [
          { unidadDeIngreso: { contains: query } },
          { apellido: { contains: query } },
          { nombres: { contains: query } },
          { alias: { contains: query } },
          { tipoDoc: { contains: query } },
          { numeroDni: { contains: query } },
          { nacionalidad: { contains: query } },
          { provincia: { contains: query } },
          { domicilios: { contains: query } },
          { numeroCausa: { contains: query } },
          { procedencia: { contains: query } },
          { orgCrim: { contains: query } },
          { cualorg: { contains: query } },
          { profesion: { contains: query } },
          { reingreso: { contains: query } },
          { establecimiento: { contains: query } },
          { titInfoPublic: { contains: query } },
          { resumen: { contains: query } },
          { observacion: { contains: query } },
          { link: { contains: query } },
          { ubicacionMap: { contains: query } },
          { electrodomesticosDetalles: { contains: query } },
          { lpu: { contains: query } },
          { sitProc: { contains: query } },
          { lpuProv: { contains: query } },
          { subGrupo: { contains: query } },
          { sexo: { contains: query } },
          { sexualidad: { contains: query } },
          { estadoCivil: { contains: query } },
          { internosinvolucrado: { contains: query } },
        ],
      },
    });
  }

  async updateFechaEgreso(
    ingresoId: number,
    egresoId: string,
    nuevaFechaEgreso: string,
  ) {
    console.log('Service - ingresoId:', ingresoId);
    console.log('Service - egresoId:', egresoId);
    console.log('Service - nuevaFechaEgreso:', nuevaFechaEgreso);

    const ingreso = await this.findOne(ingresoId);
    console.log('Service - ingreso encontrado:', ingreso);

    const historialEgresos = ingreso.historialEgresos as any;

    // Asegurarse de que cada entrada tenga un id único
    const updatedHistorial = historialEgresos.map((egreso) => {
      if (!egreso.id) {
        egreso.id = uuidv4(); // Generar un UUID si no existe
      }
      if (egreso.id === egresoId) {
        console.log('Service - Actualizando egreso:', egreso);
        return { ...egreso, fechaEgreso: nuevaFechaEgreso };
      }
      return egreso;
    });

    console.log('Service - historial actualizado:', updatedHistorial);

    return this.prismaService.ingresos.update({
      where: { id: ingresoId },
      data: { historialEgresos: updatedHistorial },
    });
  }
}
