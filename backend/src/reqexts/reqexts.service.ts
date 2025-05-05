//backend\src\rexternos\reqexts.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReqextDto } from './dto/create-reqext.dto';
import { UpdateReqextDto } from './dto/update-reqext.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReqextsService {
  constructor(private prismaService: PrismaService) {}

  async create(createReqextDto: CreateReqextDto) {
    try {
      const result = await this.prismaService.reqexts.create({
        data: createReqextDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `reqext with the provided details already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.reqexts.findMany();
    return result;
  }

  async findOne(id: number) {
    const reqextFound = await this.prismaService.reqexts.findUnique({
      where: {
        id: id,
      },
    });

    if (!reqextFound) {
      // Log de la reqext no encontrada
      throw new NotFoundException(`reqext with id ${id} not found`);
    }

    return reqextFound;
  }

  async update(id: number, updateReqextDto: UpdateReqextDto) {
    const reqextFound = await this.prismaService.reqexts.update({
      where: {
        id,
      },
      data: updateReqextDto,
    });

    if (!reqextFound) {
      // Log de la reqext no encontrada
      throw new NotFoundException(`reqext with id ${id} not found`);
    }

    return reqextFound;
  }

  async remove(id: number) {
    const deletedReqext = await this.prismaService.reqexts.delete({
      where: {
        id,
      },
    });

    if (!deletedReqext) {
      // Log de la rqext no encontrada
      throw new NotFoundException(`reqext with id ${id} not found`);
    }

    return deletedReqext;
  }
}
