const TerserPlugin = require("terser-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Solo eliminar en producción
  },

  swcMinify: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ];
    }
    return config;
  },

  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.250.220",
        port: "3900",
        pathname: "/**/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3900",
        pathname: "/**/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/pdfs/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/manifestaciones/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/manifestaciones2/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/agresiones/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/atentados/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/egresos/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/elementos/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/extramuros/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/extramuros/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/traslados/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/temas/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/habeas/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/habeas/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/huelgas/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/huelgas/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/impactos/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/impactos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/preingresos/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/prevenciones/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/procedimientos/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/sumarios/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/sumarios/uploads/:path*`, // Proxy to Backend
      },
      {
        source: "/api/reqexts/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/:path*`, // Proxy to Backend
      },

    ];
  },
};

module.exports = nextConfig;
