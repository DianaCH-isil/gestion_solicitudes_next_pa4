/** @type {import('next').NextConfig} */
// Configuración de Producción, Optimización y Seguridad - Integrante 4 (Actividad 4)
const nextConfig = {
  // 1. Eliminación automática de console.log en producción 
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // 2. Compresión Gzip/Brotli y optimización de imágenes en producción
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // 3. Cabeceras de seguridad HTTP para entorno productivo
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },

  // 4. Optimización de empaquetado
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
      };
    }
    return config;
  },
};

export default nextConfig;