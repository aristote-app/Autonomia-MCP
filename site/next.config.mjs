/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // o2switch is a shared-hosting environment with strict process limits.
    // Keep static generation essentially serial and use worker threads so
    // Next does not spawn/kill dozens of child processes during prerendering.
    cpus: 1,
    workerThreads: true
  }
};

export default nextConfig;
