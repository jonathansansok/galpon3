//backend\src\app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ImpactosModule } from './impactos/impactos.module';
import { ManifestacionesModule } from './manifestaciones/manifestaciones.module';
import { Manifestaciones2Module } from './manifestaciones2/manifestaciones2.module';
import { AgresionesModule } from './agresiones/agresiones.module';
import { IngresosModule } from './ingresos/ingresos.module';
import { PrevencionesModule } from './prevenciones/prevenciones.module';
import { SumariosModule } from './sumarios/sumarios.module';
import { HabeasModule } from './habeas/habeas.module';
import { HuelgasModule } from './huelgas/huelgas.module';
import { PreingresosModule } from './preingresos/preingresos.module';
import { ProcedimientosModule } from './procedimientos/procedimientos.module';
import { ReqextsModule } from './reqexts/reqexts.module';
import { ReqnosModule } from './reqnos/reqnos.module';
import { ReqpositivosModule } from './reqpositivos/reqpositivos.module';
import { RiesgosModule } from './riesgos/riesgos.module';
import { ExtramurosModule } from './extramuros/extramuros.module';
import { MarcasModule } from './marcas/marcas.module';
import { ModelosModule } from './modelos/modelos.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { AtentadosModule } from './atentados/atentados.module';
import { EgresosModule } from './egresos/egresos.module';
import { TemasModule } from './temas/temas.module';
import { TrasladosModule } from './traslados/traslados.module';
import { PresupuestosModule } from './presupuestos/presupuestos.module';
import { CsrfModule } from './csrf/csrf.module';
import { CsrfMiddleware } from './csrf/csrf.middleware'; // Importar el middleware de CSRF

@Module({
  imports: [
    ConfigModule,
    CsrfModule,
    ImpactosModule,
    ManifestacionesModule,
    Manifestaciones2Module,
    AgresionesModule,
    IngresosModule,
    PrevencionesModule,
    SumariosModule,
    HabeasModule,
    HuelgasModule,
    PreingresosModule,
    ProcedimientosModule,
    ReqextsModule,
    ReqnosModule,
    ReqpositivosModule,
    RiesgosModule,
    ExtramurosModule,
    MarcasModule,
    ModelosModule,
    UsersModule,
    AtentadosModule,
    EgresosModule,
    TemasModule,
    PresupuestosModule,
    TrasladosModule,
  ],
  controllers: [], // Registrar el controlador
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware) // Registrar el middleware de CSRF
      .forRoutes('*'); // Aplicar el middleware a todas las rutas
  }
}
