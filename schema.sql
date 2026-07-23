CREATE TABLE IF NOT EXISTS user_state (
  user_id TEXT PRIMARY KEY CHECK (user_id IN ('jarol', 'mateo')),
  bets_json TEXT NOT NULL DEFAULT '[]',
  settings_json TEXT NOT NULL DEFAULT '{"startingBankroll":1000,"unitSize":10}',
  transactions_json TEXT NOT NULL DEFAULT '[]',
  password_hash TEXT,
  password_salt TEXT,
  updated_at INTEGER NOT NULL DEFAULT 0
);
