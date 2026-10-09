import path from 'node:path';
import { fileURLToPath } from 'node:url';
const nextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:page.html', destination: '/:page', permanent: true },
      { source: '/:section/:slug.html', destination: '/:section/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
