import { json, readSession } from './_auth.js';

async function currentUser(request, env) {
  const user = await readSession(request, env.SESSION_SECRET);
  if (!user || !['jarol', 'mateo'].includes(user)) return null;
  return user;
}

function getDatabase(env) {
  if (!env.DB || typeof env.DB.prepare !== 'function') {
    throw new Error('Database binding "DB" is unavailable. Confirm the production binding is named DB.');
  }
  return env.DB;
}

function parseStoredJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function ensureTransactionsColumn(db) {
  try {
    await db.prepare("ALTER TABLE user_state ADD COLUMN transactions_json TEXT NOT NULL DEFAULT '[]'").run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/duplicate column/i.test(message)) throw error;
  }
}

export async function onRequestGet({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: 'Unauthorized.' }, 401);

  try {
    const db = getDatabase(env);
    await ensureTransactionsColumn(db);
    const row = await db
      .prepare('SELECT bets_json, settings_json, transactions_json, updated_at FROM user_state WHERE user_id = ?')
      .bind(user)
      .first();

    if (!row) return json({ state: null });

    return json({
      state: {
        bets: parseStoredJson(row.bets_json, []),
        settings: parseStoredJson(row.settings_json, {}),
        transactions: parseStoredJson(row.transactions_json, []),
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    console.error('D1 state read failed:', error);
    return json({ error: error instanceof Error ? error.message : 'Unable to read cloud data.' }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: 'Unauthorized.' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  if (!Array.isArray(body.bets) || typeof body.settings !== 'object' || body.settings === null) {
    return json({ error: 'Invalid ledger payload.' }, 400);
  }
  if (body.transactions !== undefined && !Array.isArray(body.transactions)) {
    return json({ error: 'Invalid ledger payload.' }, 400);
  }
  if (body.bets.length > 100000) return json({ error: 'Ledger is too large.' }, 413);

  const transactions = Array.isArray(body.transactions) ? body.transactions : [];

  try {
    const db = getDatabase(env);
    await ensureTransactionsColumn(db);
    const updatedAt = Date.now();

    await db
      .prepare(`INSERT INTO user_state (user_id, bets_json, settings_json, transactions_json, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          bets_json = excluded.bets_json,
          settings_json = excluded.settings_json,
          transactions_json = excluded.transactions_json,
          updated_at = excluded.updated_at`)
      .bind(user, JSON.stringify(body.bets), JSON.stringify(body.settings), JSON.stringify(transactions), updatedAt)
      .run();

    return json({ ok: true, updatedAt });
  } catch (error) {
    console.error('D1 state write failed:', error);
    return json({ error: error instanceof Error ? error.message : 'Unable to save cloud data.' }, 500);
  }
}
