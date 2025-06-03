/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'avatar.vercel.sh' },
      { hostname: 'lh3.googleusercontent.com' },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL,
    MEETY_ENV: process.env.NODE_ENV,
    CDN_URL: process.env.CDN_URL,
    PUBLIC_ASSET_VERSION: process.env.PUBLIC_ASSET_VERSION,
  },
};

module.exports = nextConfig;
