import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Commented out static export to enable API routes for Stripe
  // output: "export",
  trailingSlash: true,
  // distDir: "out", // Not needed without static export

  // Experimental features disabled temporarily to fix critters dependency
  // experimental: {
  //   optimizeCss: true,
  // },

  // Webpack configuration for face-api.js and Node.js polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side polyfills for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        encoding: false,
      };
    }

    // Ignore specific problematic modules in face-api.js
    config.externals = config.externals || [];
    config.externals.push({
      'encoding': 'encoding',
    });

    return config;
  },

  // Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Headers for security and PWA
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: "img-src 'self' data: blob: https://q.stripe.com https://js.stripe.com https://stripe-camo.global.ssl.fastly.net https://d1wqzb5bdbcre6.cloudfront.net https://qr.stripe.com https://b.stripecdn.com https://files.stripe.com https://upload.wikimedia.org https://radiologybusiness.com; frame-src 'self' https://checkout.stripe.com https://js.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://js.stripe.com; worker-src 'self' blob:;",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60 * 7, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60 * 7, // 7 days
        },
      },
    },
  ],
})(nextConfig);
