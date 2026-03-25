/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  swcMinify: true,

  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_R2_URL: process.env.NEXT_PUBLIC_R2_URL,
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
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
