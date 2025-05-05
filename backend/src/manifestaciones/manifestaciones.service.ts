//backend\src\manifestaciones\manifestaciones.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateManifestacionDto } from './dto/create-manifestacion.dto';
import { UpdateManifestacionDto } from './dto/update-manifestacion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ManifestacionesService {
  constructor(private prismaService: PrismaService) {}

  async create(createManifestacionDto: CreateManifestacionDto) {
    try {
      const result = await this.prismaService.manifestaciones.create({
        data: createManifestacionDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Manifestacion with identifier ${createManifestacionDto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.manifestaciones.findMany();
    return result;
  }

  async findOne(id: number) {
    const manifestacionFound =
      await this.prismaService.manifestaciones.findUnique({
        where: {
          id: id,
        },
      });

    if (!manifestacionFound) {
      // Log de la manifestación no encontrada
      throw new NotFoundException(`Manifestacion with id ${id} not found`);
    }

    return manifestacionFound;
  }

  async update(id: number, updateManifestacionDto: UpdateManifestacionDto) {
    const manifestacionFound = await this.prismaService.manifestaciones.update({
      where: {
        id,
      },
      data: updateManifestacionDto,
    });

    if (!manifestacionFound) {
      // Log de la manifestación no encontrada
      throw new NotFoundException(`Manifestacion with id ${id} not found`);
    }

    return manifestacionFound;
  }

  async remove(id: number) {
    const deletedManifestacion =
      await this.prismaService.manifestaciones.delete({
        where: {
          id,
        },
      });

    if (!deletedManifestacion) {
      // Log de la manifestación no encontrada
      throw new NotFoundException(`Manifestacion with id ${id} not found`);
    }

    return deletedManifestacion;
  }
}
