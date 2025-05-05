// backend/src/procedimientos/procedimientos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProcedimientoDto } from './dto/create-procedimiento.dto';
import { UpdateProcedimientoDto } from './dto/update-procedimiento.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProcedimientosService {
  constructor(private prismaService: PrismaService) {}

  async create(createProcedimientoDto: CreateProcedimientoDto) {
    try {
      const result = await this.prismaService.procedimientos.create({
        data: createProcedimientoDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Procedimiento with provided data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.procedimientos.findMany();
      return result;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const procedimiento = await this.prismaService.procedimientos.findUnique({
        where: { id },
      });
      if (!procedimiento) {
        // Log del procedimiento no encontrado
        throw new NotFoundException(`Procedimiento with id ${id} not found`);
      }
      return procedimiento;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateProcedimientoDto: UpdateProcedimientoDto) {
    try {
      const procedimiento = await this.prismaService.procedimientos.update({
        where: { id },
        data: updateProcedimientoDto,
      });

      if (!procedimiento) {
        console.error(
          `Procedimiento con id ${id} no encontrado para actualizar`,
        ); // Log del procedimiento no encontrado
        throw new NotFoundException(`Procedimiento with id ${id} not found`);
      }

      return procedimiento;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const procedimiento = await this.prismaService.procedimientos.delete({
        where: { id },
      });

      if (!procedimiento) {
        // Log del procedimiento no encontrado
        throw new NotFoundException(`Procedimiento with id ${id} not found`);
      }

      return procedimiento;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }
}
