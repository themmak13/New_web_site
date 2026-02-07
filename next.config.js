// 1. Import the plugin
const createNextIntlPlugin = require('next-intl/plugin');

// 2. Configure it to point to your new file
// Make sure your file is exactly at src/i18n.ts
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  // 3. Fix the API Rewrites (The "Invalid Rewrite" fix)
  async rewrites() {
    // Uses the env var if valid, otherwise a dummy placeholder to pass build
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://placeholder-api';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`, 
      },
    ];
  },
};

// 4. Wrap the config with the plugin
module.exports = withNextIntl(nextConfig);
