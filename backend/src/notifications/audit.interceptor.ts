import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { NotificationsService } from './notifications.service';
import * as jwt from 'jsonwebtoken';

const METHOD_ACTION: Record<string, string> = {
  POST: 'CREATE',
  PATCH: 'UPDATE',
  PUT: 'UPDATE',
  DELETE: 'DELETE',
};

// Routes that should NOT generate audit logs
const IGNORED_ROUTES = [
  '/api/notifications',
  '/api/auth',
  '/api/csrf',
];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly notificationsService: NotificationsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;
    const action = METHOD_ACTION[method];

    // Only log mutating operations
    if (!action) return next.handle();

    const url: string = req.originalUrl || req.url || '';

    // Skip ignored routes
    if (IGNORED_ROUTES.some((r) => url.startsWith(r))) {
      return next.handle();
    }

    // Extract entity name from URL: /api/ingresos/... -> Ingresos
    const cleanUrl = url.split('?')[0]; // remove query params
    const segments = cleanUrl.replace(/^\/api\//, '').split('/').filter(Boolean);
    const entityRaw = segments[0] || 'unknown';
    const entity = entityRaw.charAt(0).toUpperCase() + entityRaw.slice(1);

    // Extract entityId from URL if present (e.g. /api/ingresos/123)
    const entityId = segments[1] ? parseInt(segments[1], 10) || null : null;

    // Extract userId from JWT cookie
    let userId: number | null = null;
    try {
      const token = req.cookies?.jwt;
      if (token) {
        const secret = process.env.JWT_SECRET || 'default-secret-change-me';
        const decoded = jwt.verify(token, secret) as any;
        userId = decoded.sub || null;
      }
    } catch {
      // Can't decode JWT - skip audit
    }

    if (!userId) return next.handle();

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          // Build detail string
          let detail = '';
          const resultId =
            responseData?.id || responseData?.data?.id || entityId;

          if (action === 'CREATE' && resultId) {
            detail = `Nuevo registro #${resultId}`;
          } else if (action === 'UPDATE' && (entityId || resultId)) {
            detail = `Registro #${entityId || resultId} actualizado`;
          } else if (action === 'DELETE' && entityId) {
            detail = `Registro #${entityId} eliminado`;
          }

          const resultUuid =
            responseData?.uuid || responseData?.data?.uuid || null;

          // Fire and forget - don't block the response
          this.notificationsService
            .create({
              action,
              entity,
              entityId: entityId || responseData?.id || null,
              entityUuid: resultUuid,
              detail: detail || null,
              userId,
            })
            .catch((err) =>
              console.error('[AuditInterceptor] Error saving audit log:', err),
            );
        },
      }),
    );
  }
}
