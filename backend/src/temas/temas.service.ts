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
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from 'src/config/r2.config';

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
      // Parsear nombresOriginales si viene como string JSON
      if (createTemasDto.nombresOriginales && typeof createTemasDto.nombresOriginales === 'string') {
        try { createTemasDto.nombresOriginales = JSON.parse(createTemasDto.nombresOriginales); } catch { /* ignore */ }
      }

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
    console.log(`🟩 [TEMA SVC] update id=${id} START`);
    try {
      if (updateTemasDto.nombresOriginales && typeof updateTemasDto.nombresOriginales === 'string') {
        try { updateTemasDto.nombresOriginales = JSON.parse(updateTemasDto.nombresOriginales); } catch { /* ignore */ }
      }

      // Log de todos los campos de archivo antes de limpiar
      const beforeClean = this.FILE_FIELDS.map((f) => `${f}=${JSON.stringify(updateTemasDto[f])}`);
      console.log(`🟩 [TEMA SVC] file fields ANTES limpieza: ${beforeClean.join(' | ')}`);

      for (const field of this.FILE_FIELDS) {
        if (updateTemasDto[field] === '') {
          console.log(`🟩 [TEMA SVC] campo '${field}' vacío → null`);
          updateTemasDto[field] = null;
        }
      }

      const afterClean = this.FILE_FIELDS
        .filter((f) => updateTemasDto[f] !== undefined)
        .map((f) => `${f}=${JSON.stringify(updateTemasDto[f])}`);
      console.log(`🟩 [TEMA SVC] file fields DESPUÉS limpieza: ${afterClean.join(' | ')}`);
      console.log(`🟩 [TEMA SVC] llamando prisma.update id=${id}…`);

      const result = await this.prismaService.temas.update({
        where: { id },
        data: updateTemasDto,
      });

      console.log(`🟩 [TEMA SVC] ✅ prisma.update OK id=${result?.id} patente=${result?.patente}`);

      if (!result) throw new NotFoundException(`Temas record with id ${id} not found`);
      return result;
    } catch (error) {
      console.error(`🟩 [TEMA SVC] ❌ ERROR update id=${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('El registro ya existe.');
        console.error(`🟩 [TEMA SVC] Prisma error code=${error.code} meta=${JSON.stringify(error.meta)}`);
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
      try {
        await r2Client.send(new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: `temas/${filename}`,
        }));
        console.log(`[REMOVE-FILE] Archivo eliminado de R2: temas/${filename}`);
      } catch (err) {
        console.error(`[REMOVE-FILE] Error al eliminar archivo de R2: ${err.message}`);
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
