/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',   // or your specific Cloudinary domain
        port: '',          // leave empty unless using a custom port
        pathname: '/**',   // allow all paths
      },
    ],
  },
};

export default nextConfig;
