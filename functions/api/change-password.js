import { ensureCredentialColumns, hashPassword, json, readSession, verifyPassword } from './_auth.js';

export async function onRequestPost({ request, env }) {
  const user = await readSession(request, env.SESSION_SECRET);
  if (!user || !['jarol', 'mateo'].includes(user)) return json({ error: 'Unauthorized.' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  if (newPassword.length < 6) return json({ error: 'New password must be at least 6 characters.' }, 400);

  if (!env.DB || typeof env.DB.prepare !== 'function') {
    return json({ error: 'Database is unavailable. Try again shortly.' }, 500);
  }

  try {
    await ensureCredentialColumns(env.DB);
    const row = await env.DB
      .prepare('SELECT password_hash, password_salt FROM user_state WHERE user_id = ?')
      .bind(user)
      .first();

    let currentValid = false;
    if (row && row.password_hash) {
      currentValid = await verifyPassword(currentPassword, row.password_hash, row.password_salt);
    } else {
      const allowed = user === 'jarol' ? env.JAROL_PASSWORD : env.MATEO_PASSWORD;
      currentValid = !!allowed && currentPassword === allowed;
    }
    if (!currentValid) return json({ error: 'Current password is incorrect.' }, 401);

    const { hash, salt } = await hashPassword(newPassword);
    await env.DB
      .prepare(`INSERT INTO user_state (user_id, password_hash, password_salt)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          password_hash = excluded.password_hash,
          password_salt = excluded.password_salt`)
      .bind(user, hash, salt)
      .run();

    return json({ ok: true });
  } catch (error) {
    console.error('Password change failed:', error);
    return json({ error: error instanceof Error ? error.message : 'Unable to change password.' }, 500);
  }
}
