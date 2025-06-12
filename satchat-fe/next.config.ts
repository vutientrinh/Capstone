import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8280",
        pathname: "/minio/download/commons/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8280",
        pathname: "/minio/download/commons/**",
      },
      {
        protocol: "http",
        hostname: "34.143.185.136",
        port: "8280",
        pathname: "/minio/download/commons/**",
      },
      {
        protocol: "http",
        hostname: "34.143.185.136.nip.io",
        port: "8280",
        pathname: "/minio/download/commons/**",
      },
      {
        protocol: "https",
        hostname: "cadb-34-143-185-136.ngrok-free.app",
        pathname: "/minio/download/commons/**",
      },
    ],
  },
};

export default nextConfig;
