//backend\src\trabajos-realizados\trabajos-realizados.controller.ts
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
} from '@nestjs/common';
import { TrabajosRealizadosService } from './trabajos-realizados.service';
import { CreateTrabajoRealizadoDto } from './dto/create-trabajo-realizado.dto';
import { UpdateTrabajoRealizadoDto } from './dto/update-trabajo-realizado.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('trabajos-realizados')
@Controller('trabajos-realizados')
export class TrabajosRealizadosController {
  constructor(private readonly service: TrabajosRealizadosService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-turno')
  findByTurnoId(@Query('turnoId') turnoId: string) {
    if (!turnoId) throw new BadRequestException('Se requiere el parámetro turnoId');
    return this.service.findByTurnoId(turnoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTrabajoRealizadoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrabajoRealizadoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
