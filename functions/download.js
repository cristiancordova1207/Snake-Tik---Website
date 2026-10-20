// /download: descarga directa del instalador más reciente (sin mostrar el nombre del archivo de GitHub).
const LATEST = 'https://raw.githubusercontent.com/cristiancordova1207/Snake-Tik---Releases/main/latest.json';

export async function onRequest() {
  const meta = await fetch(LATEST, { cf: { cacheTtl: 120 } }).then((r) => r.json());
  const file = await fetch(meta.url);
  if (!file.ok) return Response.redirect(meta.url, 302);
  const headers = new Headers({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename="Snake Tik Setup.exe"',
    'Cache-Control': 'no-store',
  });
  const len = file.headers.get('content-length');
  if (len) headers.set('Content-Length', len);
  return new Response(file.body, { headers });
}
