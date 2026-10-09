import {config} from '@/lib/content';
import {adsTxt} from '@/lib/publishing.mjs';
export const dynamic = 'force-dynamic';
export function GET() {
  const body = adsTxt(config.adsenseClient);
  return new Response(body || 'No advertising sellers configured.\n', {
    status: body ? 200 : 404,
    headers: {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=300'},
  });
}
