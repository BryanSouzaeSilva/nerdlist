import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**", // Permite qualquer imagem do TMDB
      },
      {
        protocol: "https",
        hostname: "media.rawg.io",
        port: "",
        pathname: "/**", // Permite qualquer imagem do RAWG
      },
    ],
  },
};

export default nextConfig;