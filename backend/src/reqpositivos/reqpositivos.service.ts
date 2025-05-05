import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReqpositivoDto } from './dto/create-reqpositivo.dto';
import { UpdateReqpositivoDto } from './dto/update-reqpositivo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReqpositivosService {
  constructor(private prismaService: PrismaService) {}

  async create(createReqpositivoDto: CreateReqpositivoDto) {
    try {
      const result = await this.prismaService.reqpositivos.create({
        data: createReqpositivoDto,
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Reqpositivo with the same data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.reqpositivos.findMany();
  }

  async findOne(id: number) {
    const reqpositivoFound = await this.prismaService.reqpositivos.findUnique({
      where: {
        id: id,
      },
    });

    if (!reqpositivoFound) {
      throw new NotFoundException(`Reqpositivo with id ${id} not found`);
    }

    return reqpositivoFound;
  }

  async update(id: number, updateReqpositivoDto: UpdateReqpositivoDto) {
    const reqpositivoFound = await this.prismaService.reqpositivos.update({
      where: {
        id,
      },
      data: updateReqpositivoDto,
    });

    if (!reqpositivoFound) {
      throw new NotFoundException(`Reqpositivo with id ${id} not found`);
    }

    return reqpositivoFound;
  }

  async remove(id: number) {
    const deletedReqpositivo = await this.prismaService.reqpositivos.delete({
      where: {
        id,
      },
    });

    if (!deletedReqpositivo) {
      throw new NotFoundException(`Reqpositivo with id ${id} not found`);
    }

    return deletedReqpositivo;
  }
}
