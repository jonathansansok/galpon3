Documentación del Backend para el Modelo Temas y Flujo de Datos Genérico
Introducción
Este documento tiene como objetivo explicar la estructura y el flujo de datos del backend utilizando el modelo Temas como referencia. La explicación está dirigida a desarrolladores junior y directivos con alguna noción de programación.

Modelo Temas
El modelo Temas en Prisma define la estructura de la tabla temas en la base de datos MySQL. A continuación se presenta la definición del modelo:

id: Clave primaria autoincremental.
createdAt: Fecha y hora de creación del registro, con valor por defecto now().
updatedAt: Fecha y hora de actualización del registro, se actualiza automáticamente.
fechaHora: Campo opcional para almacenar fecha y hora.
observacion: Campo opcional para almacenar observaciones en formato de texto largo.
email: Campo opcional para almacenar el correo electrónico.
internosinvolucrado: Campo opcional para almacenar información de internos involucrados.
establecimiento, modulo_ur, pabellon: Campos para almacenar información del establecimiento, módulo y pabellón.
imagenes, imagen, imagenDer, imagenIz, imagenDact, imagenSen1, imagenSen2, imagenSen3, imagenSen4, imagenSen5, imagenSen6: Campos opcionales para almacenar URLs de imágenes.
pdf1, pdf2, pdf3, pdf4, pdf5, pdf6, pdf7, pdf8, pdf9, pdf10: Campos opcionales para almacenar URLs de archivos PDF.
word1: Campo opcional para almacenar URLs de archivos Word.
Flujo de Datos Genérico
El flujo de datos en el backend sigue una estructura similar para todos los modelos. A continuación se describe el flujo utilizando el modelo Temas como referencia.

1. Configuración Inicial
   Archivo: //backend\src\main.ts

El archivo main.ts configura la aplicación NestJS, incluyendo Swagger para la documentación de la API, CORS, y la configuración de rutas estáticas para la carga de archivos.

NestFactory: Se utiliza para crear una instancia de la aplicación NestJS.
SwaggerModule: Se utiliza para configurar la documentación de la API.
CORS: Se habilita para permitir solicitudes desde orígenes específicos.
ClassSerializerInterceptor: Se aplica globalmente para serializar las respuestas.
ValidationPipe: Se aplica globalmente para validar las solicitudes.
Static Assets: Se configuran rutas estáticas para la carga de archivos. 2. Módulo Temas
Archivo: //backend\src\temas\temas.module.ts

El módulo Temas define los servicios y controladores necesarios para manejar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para el modelo Temas.

MulterModule: Se utiliza para configurar la carga de archivos.
Controllers: Define los controladores que manejarán las solicitudes HTTP.
Providers: Define los servicios que proporcionarán la lógica de negocio. 3. Controlador Temas
Archivo: //backend\src\temas\temas.controller.ts

El controlador Temas maneja las solicitudes HTTP y llama a los métodos del servicio Temas para realizar las operaciones necesarias.

@Post: Maneja la creación de un nuevo registro de Temas.
@Get: Maneja la obtención de todos los registros de Temas.
@Get(':id'): Maneja la obtención de un registro específico de Temas por su ID.
@Patch(':id'): Maneja la actualización de un registro específico de Temas por su ID.
@Delete(':id'): Maneja la eliminación de un registro específico de Temas por su ID.
FilesInterceptor: Se utiliza para manejar la carga de múltiples archivos. 4. Servicio Temas
Archivo: //backend\src\temas\temas.service.ts

El servicio Temas proporciona la lógica de negocio para manejar las operaciones CRUD para el modelo Temas.

create: Crea un nuevo registro de Temas.
findAll: Obtiene todos los registros de Temas.
findOne: Obtiene un registro específico de Temas por su ID.
update: Actualiza un registro específico de Temas por su ID.
remove: Elimina un registro específico de Temas por su ID. 5. DTOs (Data Transfer Objects)
Archivos: create-tema.dto.ts y //backend\src\temas\dto\update-tema.dto.ts

Los DTOs se utilizan para definir la estructura de los datos que se envían y reciben a través de la API.

CreateTemaDto: Define la estructura de los datos para crear un nuevo registro de Temas.
UpdateTemaDto: Define la estructura de los datos para actualizar un registro de Temas.

Pasos para Iniciar el Proyecto
Instalar Dependencias:
npm install
Configurar Prisma y la Base de Datos MySQL:

Inicializar Prisma:
npx prisma init

Configurar el archivo .env con las credenciales de la base de datos MySQL.
Crear el esquema de la base de datos:
npx prisma migrate dev --name init

Iniciar el Servidor en Modo Desarrollo:
npm run start:devs
Construir el Proyecto para Producción:
npm run build

Iniciar el Servidor en Modo Producción:
npm run start:prod

Modificar la Base de Datos con Prisma
Modificar el Modelo en el Archivo schema.prisma:

Realiza los cambios necesarios en el modelo Temas o cualquier otro modelo.
Guardar los Cambios y Generar una Nueva Migración:
npx prisma migrate dev --name nombre_de_la_migracion

Actualizar el Cliente de Prisma:
npx prisma generate

Acceder a la Documentación de la API
La documentación de la API generada por Swagger está disponible en
http://localhost:3900/api
Conclusión
Este documento proporciona una visión general de la estructura y el flujo de datos del backend utilizando el modelo Temas como referencia. La configuración inicial, los módulos, controladores, servicios y DTOs siguen una estructura similar para otros modelos en el backend, lo que facilita la comprensión y el mantenimiento del código. Además, se incluyen los pasos para iniciar el proyecto y modificar la base de datos utilizando Prisma.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

/////// para crear todo un modulo de impacto
nest g res impactos

////////
//borrar la migracion de prisma hacia postgresql
rm -rf prisma/migrations/

//ahora puedes insertar el nuevo schema
npx prisma migrate dev --name agregonuevastablas
2025
fijate que desplegas con

npx prisma migrate dev --name init
npx prisma db push
npx prisma generate

//Después de ejecutar la migración, genera el cliente de Prisma para que tu aplicación pueda acceder a la base de datos:
npx prisma generate //tene cuidado cuando corregido el resource del modulo "VOLVE A GENERARLO"

//Es para solo agregar cambios a la base de datos actual
npx prisma migrate dev --name add-pdf2-column

//para ver en chrome la base de datos
npx prisma studio

//para subir los cambios a railway
npx prisma db push

//usa este comando para simular compilacion de typescript
tsc --noEmit

// para conectarme desde un servicio recuerda que al principio hay que tipear
nest g service prisma --no-spec //pero se usa una vez por proyecto nomas.

// para formatear prettier y para con tantas alertas de estilo
npx prettier --write .
quitar todos los console del back 

Get-ChildItem -Path .\src -Recurse -Include *.ts | ForEach-Object {
    (Get-Content $_.FullName) -replace 'catch {', 'catch (error) {' | Set-Content $_.FullName
}
// segun chatgp3
nest g res impactos
rm -rf prisma/migrations/
Crear el modelo en schema.prisma: :
model Impacto {
id Int @id @default(autoincrement())
nombre String @unique
descripcion String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
npx prisma migrate dev --name agregonuevastablas
Crear el modelo en schema.prisma: Abre
nest g service prisma --no-spec

//////////////////
archivos que hay tocar para un evento nuevo
src/reqpositivos/dto/create-reqpositivo.dto.ts
src/reqpositivos/dto/update-reqpositivo.dto.ts
src/reqpositivos/entities/reqpositivo.entity.ts
src/reqpositivos/reqpositivos.controller.ts
src/reqpositivos/reqpositivos.service.ts
src/reqpositivos/reqpositivos.module.ts

fijate que hay 3 tipos de fechas dando vueltas
{
"fechaingreso": "2024-11-17T15:00:00Z",
2024-11-17T14:30:00
1990-06-15
}

preguntas al profe, las fechas con que y donde las modifico hacia argentina?

podrias hacer que cada campo del del formulario sea un componente (para reutilizar)
que cargue fotos- google maps- modales-
dispare un mensaje por sweet alert para copiar y pegar a whats app lo que se mandó al formulario, solo si el posteo es 201, es decir posteo correcto. A su vez una vez que se haya logrado el 201 de post que se pueda expedir el formulario mediante table dentro de un pdf.
que se pueda descargar todo el historial de un modulo por excel y word.

tree -I 'node_modules|dist'
.
|-- backend
| |-- README.md
| |-- nest-cli.json
| |-- package-lock.json
| |-- package.json
| |-- prisma
| | |-- dev.db
| | |-- migrations
| | | |-- 20241118025239_agregonuevastablas
| | | | -- migration.sql
| | | -- migration_lock.toml
| | -- schema.prisma
| |-- src
| | |-- agresiones
| | | |-- agresiones.controller.spec.ts
| | | |-- agresiones.controller.ts
| | | |-- agresiones.module.ts
| | | |-- agresiones.service.spec.ts
| | | |-- agresiones.service.ts
| | | |-- dto
| | | | |-- create-agresion.dto.ts
| | | | -- update-agresion.dto.ts
| | | -- entities
| | | -- agresione.entity.ts
| | |-- app.module.ts
| | |-- elementos
| | | |-- dto
| | | | |-- create-elemento.dto.ts
| | | | -- update-elemento.dto.ts
| | | |-- elementos.controller.spec.ts
| | | |-- elementos.controller.ts
| | | |-- elementos.module.ts
| | | |-- elementos.service.spec.ts
| | | |-- elementos.service.ts
| | | -- entities
| | | -- elemento.entity.ts
| | |-- extramuros
| | | |-- dto
| | | | |-- create-extramuro.dto.ts
| | | | -- update-extramuro.dto.ts
| | | |-- entities
| | | | -- extramuro.entity.ts
| | | |-- extramuros.controller.spec.ts
| | | |-- extramuros.controller.ts
| | | |-- extramuros.module.ts
| | | |-- extramuros.service.spec.ts
| | | -- extramuros.service.ts
| | |-- habeas
| | | |-- dto
| | | | |-- create-habea.dto.ts
| | | | -- update-habea.dto.ts
| | | |-- entities
| | | | -- habea.entity.ts
| | | |-- habeas.controller.spec.ts
| | | |-- habeas.controller.ts
| | | |-- habeas.module.ts
| | | |-- habeas.service.spec.ts
| | | -- habeas.service.ts
| | |-- huelgas
| | | |-- dto
| | | | |-- create-huelga.dto.ts
| | | | -- update-huelga.dto.ts
| | | |-- entities
| | | | -- huelgas.entity.ts
| | | |-- huelgas.controller.spec.ts
| | | |-- huelgas.controller.ts
| | | |-- huelgas.module.ts
| | | |-- huelgas.service.spec.ts
| | | -- huelgas.service.ts
| | |-- impactos
| | | |-- dto
| | | | |-- create-impacto.dto.ts
| | | | -- update-impacto.dto.ts
| | | |-- entities
| | | | -- impacto.entity.ts
| | | |-- impactos.controller.spec.ts
| | | |-- impactos.controller.ts
| | | |-- impactos.module.ts
| | | |-- impactos.service.spec.ts
| | | -- impactos.service.ts
| | |-- ingresos
| | | |-- dto
| | | | |-- create-ingreso.dto.ts
| | | | -- update-ingreso.dto.ts
| | | |-- entities
| | | | -- ingreso.entity.ts
| | | |-- ingresos.controller.spec.ts
| | | |-- ingresos.controller.ts
| | | |-- ingresos.module.ts
| | | |-- ingresos.service.spec.ts
| | | -- ingresos.service.ts
| | |-- main.ts
| | |-- manifestaciones
| | | |-- dto
| | | | |-- create-manifestacion.dto.ts
| | | | -- update-manifestacion.dto.ts
| | | |-- entities
| | | | -- manifestacione.entity.ts
| | | |-- manifestaciones.controller.spec.ts
| | | |-- manifestaciones.controller.ts
| | | |-- manifestaciones.module.ts
| | | |-- manifestaciones.service.spec.ts
| | | -- manifestaciones.service.ts
| | |-- manifestaciones2
| | | |-- dto
| | | | |-- create-manifestacion2.dto.ts
| | | | -- update-manifestacion2.dto.ts
| | | |-- entities
| | | | -- manifestaciones2.entity.ts
| | | |-- manifestaciones2.controller.spec.ts
| | | |-- manifestaciones2.controller.ts
| | | |-- manifestaciones2.module.ts
| | | |-- manifestaciones2.service.spec.ts
| | | -- manifestaciones2.service.ts
| | |-- preingresos
| | | |-- dto
| | | | |-- create-preingreso.dto.ts
| | | | -- update-preingreso.dto.ts
| | | |-- entities
| | | | -- preingreso.entity.ts
| | | |-- preingresos.controller.spec.ts
| | | |-- preingresos.controller.ts
| | | |-- preingresos.module.ts
| | | |-- preingresos.service.spec.ts
| | | -- preingresos.service.ts
| | |-- prevenciones
| | | |-- dto
| | | | |-- create-prevencion.dto.ts
| | | | -- update-prevencion.dto.ts
| | | |-- entities
| | | | -- prevencione.entity.ts
| | | |-- prevenciones.controller.spec.ts
| | | |-- prevenciones.controller.ts
| | | |-- prevenciones.module.ts
| | | |-- prevenciones.service.spec.ts
| | | -- prevenciones.service.ts
| | |-- prisma
| | | -- prisma.service.ts
| | |-- procedimientos
| | | |-- dto
| | | | |-- create-procedimiento.dto.ts
| | | | -- update-procedimiento.dto.ts
| | | |-- entities
| | | | -- procedimiento.entity.ts
| | | |-- procedimientos.controller.spec.ts
| | | |-- procedimientos.controller.ts
| | | |-- procedimientos.module.ts
| | | |-- procedimientos.service.spec.ts
| | | -- procedimientos.service.ts
| | |-- products
| | | |-- dto
| | | | |-- create-product.dto.ts
| | | | -- update-product.dto.ts
| | | |-- entities
| | | | -- product.entity.ts
| | | |-- products.controller.spec.ts
| | | |-- products.controller.ts
| | | |-- products.module.ts
| | | |-- products.service.spec.ts
| | | -- products.service.ts
| | |-- reqnos
| | | |-- dto
| | | | |-- create-reqno.dto.ts
| | | | -- update-reqno.dto.ts
| | | |-- entities
| | | | -- reqno.entity.ts
| | | |-- reqnos.controller.spec.ts
| | | |-- reqnos.controller.ts
| | | |-- reqnos.module.ts
| | | |-- reqnos.service.spec.ts
| | | -- reqnos.service.ts
| | |-- reqpositivos
| | | |-- dto
| | | | |-- create-reqpositivo.dto.ts
| | | | -- update-reqpositivo.dto.ts
| | | |-- entities
| | | | -- reqpositivo.entity.ts
| | | |-- reqpositivos.controller.spec.ts
| | | |-- reqpositivos.controller.ts
| | | |-- reqpositivos.module.ts
| | | |-- reqpositivos.service.spec.ts
| | | -- reqpositivos.service.ts
| | |-- rexternos
| | | |-- dto
| | | | |-- create-rexterno.dto.ts
| | | | -- update-rexterno.dto.ts
| | | |-- entities
| | | | -- rexterno.entity.ts
| | | |-- rexternos.controller.spec.ts
| | | |-- rexternos.controller.ts
| | | |-- rexternos.module.ts
| | | |-- rexternos.service.spec.ts
| | | -- rexternos.service.ts
| | |-- riesgos
| | | |-- dto
| | | | |-- create-riesgo.dto.ts
| | | | -- update-riesgo.dto.ts
| | | |-- entities
| | | | -- riesgo.entity.ts
| | | |-- riesgos.controller.spec.ts
| | | |-- riesgos.controller.ts
| | | |-- riesgos.module.ts
| | | |-- riesgos.service.spec.ts
| | | -- riesgos.service.ts
| | |-- sumarios
| | | |-- dto
| | | | |-- create-sumario.dto.ts
| | | | -- update-sumario.dto.ts
| | | |-- entities
| | | | -- sumario.entity.ts
| | | |-- sumarios.controller.spec.ts
| | | |-- sumarios.controller.ts
| | | |-- sumarios.module.ts
| | | |-- sumarios.service.spec.ts
| | | -- sumarios.service.ts
| | -- users
| | |-- dto
| | | |-- create-user.dto.ts
| | | -- update-user.dto.ts
| | |-- entities
| | | -- user.entity.ts
| | |-- users.controller.spec.ts
| | |-- users.controller.ts
| | |-- users.module.ts
| | |-- users.service.spec.ts
| | -- users.service.ts
| |-- test
| | |-- app.e2e-spec.ts
| | -- jest-e2e.json
| |-- tsconfig.build.json
| -- tsconfig.json
-- frontend
|-- README.md
|-- components.json
|-- next-env.d.ts
|-- next.config.mjs
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- public
| |-- next.svg
| -- vercel.svg
|-- src
| |-- app
| | |-- favicon.ico
| | |-- globals.css
| | |-- layout.tsx
| | |-- page.tsx
| | -- products
| | |-- [id]
| | | |-- edit
| | | | -- page.tsx
| | | -- page.tsx
| | |-- new
| | | |-- areajob.code-workspace
| | | |-- page.tsx
| | | -- product-form.tsx
| | -- products.api.ts
| |-- components
| | |-- product-card.tsx
| | -- ui
| | |-- button.tsx
| | |-- card.tsx
| | |-- input.tsx
| | -- label.tsx
| -- lib
| -- utils.ts
|-- tailwind.config.ts
|-- tree.txt
-- tsconfig.json

75 directories, 195 files

2025/////
Las diferencias entre `npx prisma migrate dev` y `npx prisma migrate deploy` radican en **cómo y dónde se aplican las migraciones**, y están diseñadas para diferentes entornos (desarrollo vs. producción). Aquí te explico las diferencias:

---

### **1. `npx prisma migrate dev`**

- **Propósito**: Diseñado para **entornos de desarrollo**.
- **Qué hace**:
  1. Detecta cambios en el archivo `schema.prisma` y genera una nueva migración si es necesario.
  2. Aplica las migraciones pendientes a la base de datos.
  3. Si hay un desfase entre el historial de migraciones y el esquema actual de la base de datos, te pedirá que reinicies la base de datos con `prisma migrate reset`.
  4. Proporciona mensajes detallados y útiles para los desarrolladores.
- **Impacto en los datos**:
  - Puede eliminar y recrear la base de datos (si usas `prisma migrate reset`), lo que significa que **puedes perder datos**.
- **Uso recomendado**:
  - Solo en entornos de desarrollo, donde puedes permitirte perder datos y necesitas iterar rápidamente en el esquema.

---

### **2. `npx prisma migrate deploy`**

- **Propósito**: Diseñado para **entornos de producción**.
- **Qué hace**:
  1. Aplica las migraciones pendientes a la base de datos **sin generar nuevas migraciones**.
  2. No intenta sincronizar el esquema automáticamente ni reinicia la base de datos.
  3. Solo ejecuta las migraciones que ya existen en la carpeta `prisma/migrations`.
- **Impacto en los datos**:
  - No elimina ni recrea la base de datos. Solo aplica los cambios definidos en las migraciones existentes.
  - Es seguro para entornos de producción.
- **Uso recomendado**:
  - En producción o en cualquier entorno donde no puedas permitirte perder datos.

---

### **Diferencias clave**

| Característica                | `npx prisma migrate dev`                       | `npx prisma migrate deploy`             |
| ----------------------------- | ---------------------------------------------- | --------------------------------------- |
| **Entorno**                   | Desarrollo                                     | Producción                              |
| **Genera nuevas migraciones** | Sí, si detecta cambios en el esquema.          | No, solo aplica migraciones existentes. |
| **Aplica migraciones**        | Sí                                             | Sí                                      |
| **Sincroniza el esquema**     | Sí, puede requerir reiniciar la base de datos. | No, solo aplica migraciones.            |
| **Impacto en los datos**      | Puede eliminar datos (si se usa `reset`).      | No afecta los datos existentes.         |
| **Mensajes detallados**       | Sí, para ayudar a los desarrolladores.         | No, es más silencioso.                  |

---

### **Flujo recomendado**

1. **En desarrollo**:

   - Usa `npx prisma migrate dev` para iterar rápidamente en el esquema y generar nuevas migraciones.
   - Asegúrate de incluir las migraciones generadas en el control de versiones (`prisma/migrations`).

2. **En producción**:
   - Usa `npx prisma migrate deploy` para aplicar las migraciones existentes de manera segura.
   - Nunca uses `npx prisma migrate dev` en producción, ya que podría intentar reiniciar la base de datos o generar migraciones no deseadas.

---

### **Ejemplo práctico**

#### **En desarrollo:**

1. Realizas un cambio en `schema.prisma` (por ejemplo, agregas una nueva tabla).
2. Ejecutas:

   ```bash
   npx prisma migrate dev --name add_new_table
   ```

   Esto:

   - Genera una nueva migración en `prisma/migrations`.
   - Aplica la migración a tu base de datos local.

3. Subes los cambios al repositorio:
   ```bash
   git add prisma/migrations schema.prisma
   git commit -m "Add new table"
   git push
   ```

#### **En producción:**

1. En el servidor de producción, descargas los cambios del repositorio:

   ```bash
   git pull
   ```

2. Aplicas las migraciones existentes:
   ```bash
   npx prisma migrate deploy
   ```
   Esto asegura que las migraciones se apliquen sin afectar los datos existentes.

---

### **Conclusión**

- Usa `npx prisma migrate dev` en desarrollo para iterar rápidamente y generar nuevas migraciones.
- Usa `npx prisma migrate deploy` en producción para aplicar migraciones existentes de manera segura.
- Mantén sincronizadas las migraciones (`prisma/migrations`) en el control de versiones para evitar problemas de desfase entre entornos. 😊
