import { createSession, ensureCredentialColumns, json, sessionCookie, verifyPassword } from './_auth.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const user = String(body.user || '').toLowerCase();
  const password = String(body.password || '');
  if (!['jarol', 'mateo'].includes(user)) return json({ error: 'Incorrect account or password.' }, 401);

  let authenticated = false;
  if (env.DB && typeof env.DB.prepare === 'function') {
    try {
      await ensureCredentialColumns(env.DB);
      const row = await env.DB.prepare('SELECT password_hash, password_salt FROM user_state WHERE user_id = ?').bind(user).first();
      if (row && row.password_hash) authenticated = await verifyPassword(password, row.password_hash, row.password_salt);
    } catch (error) {
      console.error('Password lookup failed:', error);
    }
  }

  if (!authenticated) {
    const allowed = user === 'jarol' ? env.JAROL_PASSWORD : env.MATEO_PASSWORD;
    authenticated = !!allowed && password === allowed;
  }

  if (!authenticated) return json({ error: 'Incorrect account or password.' }, 401);
  const token = await createSession(user, env.SESSION_SECRET);
  return json({ user }, 200, { 'Set-Cookie': sessionCookie(token) });
}
