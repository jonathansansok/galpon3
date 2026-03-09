import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.jwt || null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-change-me',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      nombre: payload.nombre,
      apellido: payload.apellido,
      telefono: payload.telefono,
      privilege: payload.privilege,
      comp: payload.comp,
    };
  }
}
