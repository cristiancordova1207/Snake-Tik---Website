// Apunta una visita o descarga en las estadísticas de Stats Fluxy (vía dance-api, sin claves en la web).
const API = 'https://dcepxcltgzipkmzpptzn.supabase.co/functions/v1/dance-api';

export function track(request, site, kind, referrer) {
  const cf = request.cf || {};
  const ua = request.headers.get('user-agent') || '';
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Otro';
  let ref = '';
  try { ref = referrer ? new URL(referrer).hostname : ''; } catch { /* nada */ }
  return fetch(API, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'track', site, kind, country: cf.country, region: cf.region, city: cf.city,
      lat: cf.latitude ? Number(cf.latitude) : undefined, lon: cf.longitude ? Number(cf.longitude) : undefined, os, referrer: ref }),
  }).catch(() => {});
}
