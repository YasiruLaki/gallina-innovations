import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  images: {
    // allow external images from any origin for now
    unoptimized: true,
  },
};

// const nextConfig: NextConfig = {
//   reactStrictMode: false,
//   devIndicators: false,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.gallinainnovations.com',
//       },
//     ],
//   },
// };

export default nextConfig;