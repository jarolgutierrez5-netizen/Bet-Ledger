import { createSession, json, sessionCookie } from './_auth.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const user = String(body.user || '').toLowerCase();
  const password = String(body.password || '');
  const allowed = user === 'jarol' ? env.JAROL_PASSWORD : user === 'mateo' ? env.MATEO_PASSWORD : null;
  if (!allowed || password !== allowed) return json({ error: 'Incorrect account or password.' }, 401);
  const token = await createSession(user, env.SESSION_SECRET);
  return json({ user }, 200, { 'Set-Cookie': sessionCookie(token) });
}
