/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ['https://sparkly-halva-73cb5e.netlify.app/'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
