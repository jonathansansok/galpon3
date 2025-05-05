//backend\src\csrf\csrf.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CsrfService } from './csrf.service';

@Controller('csrf')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get('token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    console.log('[CSRF] Controlador ejecutado antes de generar token');
    const token = this.csrfService.generateToken(req, res); // Generar o reutilizar el token
    console.log('[CSRF] Token CSRF generado o reutilizado:', token);

    return res.status(200).json({ csrfToken: token });
  }
}
