import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // Autorizando o domínio das imagens
      },
    ],
  },
};

export default nextConfig;