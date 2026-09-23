/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
    workerThreads: false,
    memoryBasedWorkersCount: false,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 10000
  }
};

export default nextConfig;
