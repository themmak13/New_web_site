const createNextIntlPlugin = require('next-intl/plugin');

// NO PATH ARGUMENT NEEDED - it automatically looks for src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://placeholder-api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`, 
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
