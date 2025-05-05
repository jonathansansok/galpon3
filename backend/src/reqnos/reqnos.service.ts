import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReqnoDto } from './dto/create-reqno.dto';
import { UpdateReqnoDto } from './dto/update-reqno.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReqnosService {
  constructor(private prismaService: PrismaService) {}

  async create(createReqnoDto: CreateReqnoDto) {
    try {
      const result = await this.prismaService.reqnos.create({
        data: createReqnoDto,
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Reqno with email ${createReqnoDto.email} already exists`,
          );
        }
      }

      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.reqnos.findMany();
  }

  async findOne(id: number) {
    const reqnoFound = await this.prismaService.reqnos.findUnique({
      where: {
        id: id,
      },
    });

    if (!reqnoFound) {
      throw new NotFoundException(`Reqno with id ${id} not found`);
    }

    return reqnoFound;
  }

  async update(id: number, updateReqnoDto: UpdateReqnoDto) {
    const reqnoFound = await this.prismaService.reqnos.update({
      where: {
        id,
      },
      data: updateReqnoDto,
    });

    if (!reqnoFound) {
      throw new NotFoundException(`Reqno with id ${id} not found`);
    }

    return reqnoFound;
  }

  async remove(id: number) {
    const deletedReqno = await this.prismaService.reqnos.delete({
      where: {
        id,
      },
    });

    if (!deletedReqno) {
      throw new NotFoundException(`Reqno with id ${id} not found`);
    }

    return deletedReqno;
  }
}
