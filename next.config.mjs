/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',   // or your specific Cloudinary custom domain
        port: '',                        // usually empty unless using a custom port
        pathname: '/**',                 // allow any path
      },
    ],
  }
};

export default nextConfig;
