import path from 'node:path';
import fs from 'node:fs';
const guideRedirects=JSON.parse(fs.readFileSync(new URL('./src/content/guide-redirects.json',import.meta.url),'utf8'));
import { fileURLToPath } from 'node:url';
const nextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  async redirects() {
    return [
      ...Object.entries(guideRedirects).map(([from,to])=>({source:'/guides/'+from,destination:'/guides/'+to,permanent:true})),
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:page.html', destination: '/:page', permanent: true },
      { source: '/:section/:slug.html', destination: '/:section/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
