//backend\src\app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { IngresosModule } from './ingresos/ingresos.module';
import { MarcasModule } from './marcas/marcas.module';
import { ModelosModule } from './modelos/modelos.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { TemasModule } from './temas/temas.module';
import { PresupuestosModule } from './presupuestos/presupuestos.module';
import { TurnosModule } from './turnos/turnos.module';
import { TrabajosRealizadosModule } from './trabajos-realizados/trabajos-realizados.module';
import { PiezasModule } from './piezas/piezas.module';
import { PartesModule } from './partes/partes.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditInterceptor } from './notifications/audit.interceptor';
import { CsrfModule } from './csrf/csrf.module';
import { CsrfMiddleware } from './csrf/csrf.middleware';
import { PlazasModule } from './plazas/plazas.module';
import { PisosModule } from './pisos/pisos.module';
import { HorarioModule } from './horario/horario.module';
import { FeriadosModule } from './feriados/feriados.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule,
    CsrfModule,
    IngresosModule,
    MarcasModule,
    ModelosModule,
    UsersModule,
    TemasModule,
    PresupuestosModule,
    TurnosModule,
    TrabajosRealizadosModule,
    PiezasModule,
    PartesModule,
    AuthModule,
    NotificationsModule,
    PlazasModule,
    PisosModule,
    HorarioModule,
    FeriadosModule,
  ],
  controllers: [HealthController],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes('*');
  }
}
