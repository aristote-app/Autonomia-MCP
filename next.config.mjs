/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/formation-ia/gouvernance-ia-ai-act",
        destination: "/formation-ai-act",
        permanent: true
      }
    ];
  },
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
