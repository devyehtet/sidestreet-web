export function publicOrigin(value) {
  if (!value) return '';
  try {
    const u = new URL(value);
    const h = u.hostname.toLowerCase();
    if (u.protocol !== 'https:' || u.username || u.password || u.pathname !== '/' || u.search || u.hash || u.port) return '';
    if (!h.includes('.') || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h) || h.endsWith('.local') || ['example.com','your-real-domain.com'].includes(h)) return '';
    return u.origin;
  } catch { return ''; }
}
export function adsenseClient(value) {
  return /^ca-pub-\d{16}$/.test(value || '') && value !== 'ca-pub-0000000000000000' ? value : '';
}
export function contactEmail(value) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value || '') ? value : '';
}
export function resolvePublishing(raw, env = {}) {
  return {
    ...raw,
    siteUrl: publicOrigin(env.NEXT_PUBLIC_SITE_URL || raw.siteUrl),
    contactEmail: contactEmail(raw.contactEmail),
    adsenseClient: adsenseClient(env.ADSENSE_CLIENT || raw.adsenseClient),
    analyticsMeasurementId: /^G-[A-Z0-9]+$/.test(env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '') ? env.NEXT_PUBLIC_GA_MEASUREMENT_ID : '',
    googleSiteVerification: env.GOOGLE_SITE_VERIFICATION || raw.googleSiteVerification || '',
  };
}
export function adsTxt(client) {
  const id = adsenseClient(client);
  return id ? `google.com, ${id.slice(3)}, DIRECT, f08c47fec0942fa0\n` : '';
}
export function canServeAds(config) {
  return Boolean(config.adsenseEnabled === true && config.consentConfigured === true && publicOrigin(config.siteUrl) && adsenseClient(config.adsenseClient));
}
