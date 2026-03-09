import {
  Controller,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findByEmail')
  async findByEmail(@Query() query: FindUserByEmailDto) {
    return this.usersService.findByEmail(query.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    if (req.user.privilege !== 'A1') {
      throw new ForbiddenException('Solo administradores');
    }
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; email?: string; privilege?: string; comp?: string },
  ) {
    if (req.user.privilege !== 'A1') {
      throw new ForbiddenException('Solo administradores');
    }
    console.log('[UsersController] PUT /users/' + id, body);
    return this.usersService.updateUser(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (req.user.privilege !== 'A1') {
      throw new ForbiddenException('Solo administradores');
    }
    if (req.user.userId === id) {
      throw new ForbiddenException('No podés eliminarte a vos mismo');
    }
    console.log('[UsersController] DELETE /users/' + id);
    return this.usersService.deleteUser(id);
  }
}
