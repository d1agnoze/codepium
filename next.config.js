/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bbqwabpptjaxjsdmvfcc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

module.exports = nextConfig;
