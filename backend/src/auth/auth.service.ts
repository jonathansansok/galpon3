import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('[AuthService] validateUser called for:', email);
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status === 'PENDIENTE') {
        throw new UnauthorizedException('Tu cuenta está pendiente de aprobación por un administrador');
      }
      if (user.status === 'RECHAZADO') {
        throw new UnauthorizedException('Tu solicitud de registro fue rechazada');
      }
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
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      privilege: user.privilege,
      comp: user.comp,
    };
    const token = this.jwtService.sign(payload);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 12 * 60 * 60 * 1000, // 12 horas
      path: '/',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        privilege: user.privilege,
        comp: user.comp,
      },
    };
  }

  async register(
    email: string,
    password: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
  ) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      email,
      password: hashedPassword,
      nombre,
      apellido,
      telefono,
    });

    // Crear notificación para admins
    await this.notificationsService.create({
      action: 'CREATE',
      entity: 'Solicitud',
      entityId: user.id,
      detail: `Nueva solicitud de registro: ${email}`,
      userId: user.id,
    });

    const { password: _, ...result } = user;
    return { ...result, message: 'Solicitud enviada. Un administrador revisará tu cuenta.' };
  }

  async logout(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
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
