// backend/src/temas/temas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class TemasService {
  constructor(private prismaService: PrismaService) {}
  async getClienteAsociado(temaId: number) {
    const tema = await this.prismaService.temas.findUnique({
      where: { id: temaId },
      include: { cliente: true }, // Incluye los datos del cliente asociado
    });

    if (!tema || !tema.cliente) {
      throw new NotFoundException('Cliente asociado no encontrado');
    }

    return tema.cliente;
  }
  async create(createTemasDto: CreateTemaDto) {
    try {
      console.log('[DEBUG] DTO recibido en el servicio:', createTemasDto);

      const result = await this.prismaService.temas.create({
        data: createTemasDto,
      });

      console.log('[DEBUG] Resultado de Prisma:', result);
      return result;
    } catch (error) {
      console.error('[ERROR] Error en el servicio al crear tema:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El registro ya existe.');
        }
      }

      throw new InternalServerErrorException('Error al crear el tema');
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.temas.findMany({});
      return result;
    } catch (error) {
      console.error('[ERROR] Error al buscar los registros de temas:', error);
      throw new InternalServerErrorException(
        'Error al buscar los registros de temas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const TemasFound = await this.prismaService.temas.findUnique({
        where: {
          id: id,
        },
      });

      if (!TemasFound) {
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return TemasFound;
    } catch (error) {
      console.error('[ERROR] Error al buscar el registro de temas:', error);
      throw new InternalServerErrorException(
        'Error al buscar el registro de temas',
      );
    }
  }

  async update(id: number, updateTemasDto: UpdateTemaDto) {
    try {
      // Limpiar campos de archivos que se enviaron como vacíos (eliminados desde frontend)
      for (const field of this.FILE_FIELDS) {
        if (updateTemasDto[field] === '') {
          updateTemasDto[field] = null;
        }
      }

      const result = await this.prismaService.temas.update({
        where: {
          id,
        },
        data: updateTemasDto,
      });

      if (!result) {
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return result;
    } catch (error) {
      console.error('[ERROR] Error al actualizar el tema:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El registro ya existe.');
        }
      }

      throw new InternalServerErrorException('Error al actualizar el tema');
    }
  }

  private readonly FILE_FIELDS = [
    'imagen', 'imagenDer', 'imagenIz', 'imagenDact',
    'imagenSen1', 'imagenSen2', 'imagenSen3', 'imagenSen4', 'imagenSen5', 'imagenSen6',
    'pdf1', 'pdf2', 'pdf3', 'pdf4', 'pdf5', 'pdf6', 'pdf7', 'pdf8', 'pdf9', 'pdf10',
    'word1',
  ];

  async removeFile(id: number, field: string) {
    if (!this.FILE_FIELDS.includes(field)) {
      throw new BadRequestException(`Campo "${field}" no es un campo de archivo válido`);
    }

    const tema = await this.findOne(id);
    const filename = tema[field];

    if (filename) {
      const uploadsDir = field === 'imagenDer'
        ? join(__dirname, '..', 'uploads', 'der')
        : join(__dirname, '..', 'uploads');

      const filePath = join(uploadsDir, filename);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`[REMOVE-FILE] Archivo eliminado del disco: ${filePath}`);
        } else {
          console.warn(`[REMOVE-FILE] Archivo no encontrado en disco: ${filePath}`);
        }
      } catch (err) {
        console.error(`[REMOVE-FILE] Error al eliminar archivo del disco: ${err.message}`);
      }
    }

    return this.prismaService.temas.update({
      where: { id },
      data: { [field]: null },
    });
  }

  async remove(id: number) {
    try {
      const deletedTemas = await this.prismaService.temas.delete({
        where: {
          id,
        },
      });

      if (!deletedTemas) {
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return deletedTemas;
    } catch (error) {
      console.error('[ERROR] Error al eliminar el tema:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el registro de temas',
      );
    }
  }
}
