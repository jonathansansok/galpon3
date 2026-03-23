//backend\src\csrf\csrf.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CsrfService {
  generateToken(req, res): string {
    const existingToken = req.cookies['csrf-token']; // Verificar si ya existe un token en las cookies
    if (existingToken) {
      console.log('[CSRF] Reutilizando token CSRF existente:', existingToken);
      return existingToken; // Reutilizar el token existente
    }

    console.log('[CSRF] Generando nuevo token CSRF...');
    const token = crypto.randomBytes(64).toString('hex'); // Generar un nuevo token
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('csrf-token', token, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });
    return token;
  }

  validateToken(req): boolean {
    const tokenFromHeader = req.headers['csrf-token'];

    if (!tokenFromHeader) {
      console.error('[CSRF] Token CSRF ausente en el header.');
      return false;
    }

    console.log('[CSRF] Token válido.');
    return true;
  }
}
