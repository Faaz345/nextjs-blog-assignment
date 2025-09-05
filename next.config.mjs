/**
 * Next.js configuration
 * - Enables React strict mode
 * - Allows remote images from common demo providers
 */

// @ts-check

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' }
    ]
  }
};

export default nextConfig;

