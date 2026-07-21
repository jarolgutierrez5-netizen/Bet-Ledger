import { json, readSession } from './_auth.js';

async function currentUser(request, env) {
  const user = await readSession(request, env.SESSION_SECRET);
  if (!user || !['jarol', 'mateo'].includes(user)) return null;
  return user;
}

export async function onRequestGet({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: 'Unauthorized.' }, 401);
  const row = await env.BETLEDGER_DB.prepare('SELECT bets_json, settings_json, updated_at FROM user_state WHERE user_id = ?').bind(user).first();
  if (!row) return json({ state: null });
  return json({ state: { bets: JSON.parse(row.bets_json), settings: JSON.parse(row.settings_json), updatedAt: row.updated_at } });
}

export async function onRequestPut({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: 'Unauthorized.' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!Array.isArray(body.bets) || typeof body.settings !== 'object' || body.settings === null) return json({ error: 'Invalid ledger payload.' }, 400);
  if (body.bets.length > 100000) return json({ error: 'Ledger is too large.' }, 413);
  const updatedAt = Date.now();
  await env.BETLEDGER_DB.prepare(`INSERT INTO user_state (user_id, bets_json, settings_json, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET bets_json = excluded.bets_json, settings_json = excluded.settings_json, updated_at = excluded.updated_at`)
    .bind(user, JSON.stringify(body.bets), JSON.stringify(body.settings), updatedAt).run();
  return json({ ok: true, updatedAt });
}
