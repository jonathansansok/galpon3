//backend\src\users\users.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

@ApiTags('users')
@Controller('users') // Agrega el prefijo '/api'
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findByEmail')
  async findByEmail(@Query() query: FindUserByEmailDto) {
    return this.usersService.findByEmail(query.email);
  }
}
