/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'export',
  transpilePackages: ['tailwindcss'],
  // Support for web workers
  webpack: (config) => {
    config.output.globalObject = 'self';
    return config;
  },
}

module.exports = nextConfig
