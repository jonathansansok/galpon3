import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfService } from './csrf.service';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private readonly csrfService: CsrfService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (!this.csrfService.validateToken(req)) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }
    }
    next();
  }
}
