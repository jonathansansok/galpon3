This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources: ok

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
Sí, esa configuración está perfecta para garantizar que todos los archivos usen LF como fin de línea en Visual Studio Code. Aquí tienes un desglose de cada configuración y lo que hace:

json
Ve a File > Preferences > Settings (o Code > Preferences > Settings en Mac).

Haz clic en el ícono de archivo con el símbolo {} en la esquina superior derecha para abrir el archivo settings.json.
Copiar código
{
"files.eol": "\n", // Establece que todos los archivos nuevos usen LF como fin de línea.
"editor.defaultFormatter": "esbenp.prettier-vscode", // Configura Prettier como el formateador predeterminado.
"prettier.endOfLine": "lf", // Obliga a Prettier a usar LF al formatear.
"editor.formatOnSave": true // Habilita el formateo automático al guardar.
}
Cómo Funciona Esta Configuración
Nuevos Archivos: Siempre usarán LF como fin de línea.
Formateador Predeterminado: Se asegura de que Prettier sea el formateador para todos los lenguajes que soporte.
Estilo Uniforme: Al guardar cualquier archivo, Prettier ajustará automáticamente el fin de línea a LF.
Compatibilidad: Compatible con proyectos colaborativos donde se usa Prettier para mantener estilos consistentes.
Siguientes Pasos (Opcional)
Verifica la instalación de Prettier:

Ve a Extensiones (Ctrl+Shift+X o Cmd+Shift+X) y asegúrate de que tienes "Prettier - Code Formatter" instalado.
Formatea tu proyecto existente: Si ya tienes archivos con diferentes tipos de fin de línea y quieres estandarizarlos:

Abre la terminal integrada (Ctrl+ñ o Cmd+ñ).
Ejecuta:
bash
Copiar código
npx prettier --write .
Esto convertirá todos los archivos del proyecto a usar LF.
Con esta configuración, tu entorno de desarrollo estará bien preparado para manejar finales de línea de manera uniforme. 🎉

ESTILOS RECORDA QUE  
//frontend\src\app\portal\eventos\manifestaciones\new\manifestacion-form.tsx

   <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">

//frontend\src\app\portal\eventos\manifestaciones\new\page.tsx
<div className="h-screen flex justify-center items-start">
ES DONDE SE CAMBIAN MUCHOS ESTILOS


recorda .grid-cols-5 {
  /* grid-template-columns: repeat(5, minmax(0, 1fr)); */
}es el que AL NO estar causa buen responsive celuar



🚨 ALTO RIESGO y ROSARINO
✅ SECUESTROS
🔥 FOCO ÍGNEO
🚷 OBITO
🗣 AOI
📌 REPORTE DE SITUACIÓN

IMPLEMENTACION PARA LA CLASIFICACION DE NOVEDADES AL INICIO DE CADA UNA SEGUN CORRESPONDA
🟥 Clas. Seg. ALTA
🟨 Clas. Seg. MEDIA
🟩 Clas. Seg. BAJ

RECORDA PARA UPDATE Y DELETE
frontend\src\app\portal\eventos\ingresos\[id]\page.tsx MODIFICAR ESTA ARCHIVO
PONIENDO ingreso.establecimiento
ingreso.unidaddegreso...etc...
RECORDA QUE     <div className="flex justify-center items-center flex-col w-full px-4 py-6"> FUE LO QUE
HIZO BAJAR AL FOOTER DE UNA vez POR TODAS!!!

recorda que para el get full y 
