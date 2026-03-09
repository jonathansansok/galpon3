/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  swcMinify: true,

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
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/:path*`,
      },
      {
        source: "/api/pdfs/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/:path*`,
      },
      {
        source: "/api/temas/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/:path*`,
      },
      {
        source: "/api/presupuestos/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/presupuestos/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
