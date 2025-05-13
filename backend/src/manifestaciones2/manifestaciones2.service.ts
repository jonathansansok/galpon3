// src/manifestaciones2/manifestaciones2.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateManifestacion2Dto } from './dto/create-manifestacion2.dto';
import { UpdateManifestacion2Dto } from './dto/update-manifestacion2.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class Manifestaciones2Service {
  constructor(private prismaService: PrismaService) {}

  async create(createManifestacion2Dto: CreateManifestacion2Dto) {
    try {
      console.log(
        'Datos recibidos en el servicio (POST):',
        createManifestacion2Dto,
      ); // Log de los datos recibidos

      const result = await this.prismaService.manifestaciones2.create({
        data: createManifestacion2Dto,
      });

      // Log del resultado de la creación

      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error(
            'Conflicto: manifestación2 ya existe:',
            createManifestacion2Dto.establecimiento,
          ); // Log del error de conflicto
          throw new ConflictException(
            `Manifestacion2 with identifier ${createManifestacion2Dto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.manifestaciones2.findMany();
    return result;
  }

  async findOne(id: number) {
    const manifestacion2Found =
      await this.prismaService.manifestaciones2.findUnique({
        where: {
          id: id,
        },
      });

    if (!manifestacion2Found) {
      // Log de la manifestación no encontrada
      throw new NotFoundException(`Manifestacion2 with id ${id} not found`);
    }

    return manifestacion2Found;
  }

  async update(id: number, updateManifestacion2Dto: UpdateManifestacion2Dto) {
    console.log(
      'Datos recibidos para actualizar (PATCH):',
      updateManifestacion2Dto,
    ); // Log de los datos recibidos

    const manifestacion2Found =
      await this.prismaService.manifestaciones2.update({
        where: {
          id,
        },
        data: updateManifestacion2Dto,
      });

    console.log(
      'Resultado de la actualización en la base de datos:',
      manifestacion2Found,
    ); // Log del resultado de la actualización

    if (!manifestacion2Found) {
      // Log de la manifestación no encontrada
      throw new NotFoundException(`Manifestacion2 with id ${id} not found`);
    }

    return manifestacion2Found;
  }
  async remove(id: number) {
    const deletedManifestacion2 =
      await this.prismaService.manifestaciones2.delete({
        where: {
          id,
        },
      });

    if (!deletedManifestacion2) {
      // Log de la manifestación no encontrada
      throw new NotFoundException(`Manifestacion2 with id ${id} not found`);
    }

    return deletedManifestacion2;
  }
}
