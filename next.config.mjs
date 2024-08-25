/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:[{
      hostname:"utfs.io",
    }],
    domains: ["utfs.io", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
