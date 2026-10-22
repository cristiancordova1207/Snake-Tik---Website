import { track } from '../_track.js';

export async function onRequestPost({ request, waitUntil }) {
  const body = await request.json().catch(() => ({}));
  waitUntil(track(request, 'snaketik', 'visit', body.ref));
  return new Response(null, { status: 204 });
}
