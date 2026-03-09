import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('[AuthService] validateUser called for:', email);
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('[AuthService] validateUser success for:', email);
      const { password: _, ...result } = user;
      return result;
    }
    console.log('[AuthService] validateUser failed for:', email, '- user found:', !!user);
    return null;
  }

  async login(user: any, res: Response) {
    console.log('[AuthService] login called for:', user?.email);
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      privilege: user.privilege,
      comp: user.comp,
    };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
      path: '/',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        privilege: user.privilege,
        comp: user.comp,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      email,
      password: hashedPassword,
      name,
    });

    const { password: _, ...result } = user;
    return result;
  }

  async logout(res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Sesión cerrada' };
  }

  async getProfile(userId: number) {
    console.log('[AuthService] getProfile called for userId:', userId);
    const user = await this.usersService.findById(userId);
    if (!user) return null;
    const { password: _, resetToken: _rt, resetTokenExpiry: _rte, ...result } = user;
    return result;
  }

  async generateResetToken(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.usersService.setResetToken(user.id, hashedToken, expiry);

    return { resetToken: rawToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.clearResetToken(user.id);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
