import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log('[AuthController] POST /login - user:', req.user?.email);
    return this.authService.login(req.user, res);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('[AuthController] POST /register - registerDto:', JSON.stringify(registerDto));
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.nombre,
      registerDto.apellido,
      registerDto.telefono,
    );
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    console.log('[AuthController] GET /me - userId:', req.user?.userId);
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('forgot-password')
  async forgotPassword(@Request() req, @Body() forgotPasswordDto: ForgotPasswordDto) {
    // Solo admins (privilege A1) pueden generar tokens de reset
    if (req.user.privilege !== 'A1') {
      return { message: 'No autorizado' };
    }
    return this.authService.generateResetToken(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
