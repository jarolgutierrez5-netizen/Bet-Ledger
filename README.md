# BetLedger Pro v2.8 — Cloudflare D1 Binding Fix

This release fixes the Cloudflare D1 `500` error caused by a binding-name mismatch.

## Fixed

- The Pages project exposes the D1 database as `DB`.
- `functions/api/state.js` now reads and writes through `env.DB`.
- `wrangler.toml` now uses `binding = "DB"` so local configuration matches production.
- The state API now returns useful D1 error messages and writes detailed errors to Cloudflare Functions logs.
- Automatic cloud saving, cloud loading, offline cache, retries, and cross-device refresh remain enabled.

## Required update

For this release, replace these files in the GitHub repository:

- `index.html`
- `README.md`
- `functions/api/state.js`
- `wrangler.toml`

Keep the following unchanged:

- `functions/api/_auth.js`
- `functions/api/login.js`
- `functions/api/logout.js`
- `functions/api/session.js`
- `schema.sql`
- Cloudflare secrets
- Existing D1 database data

Your Cloudflare Pages D1 binding must remain:

```text
Variable name: DB
Database: betledger-db
```

After committing, allow Cloudflare Pages to deploy the new version.

## Verification

1. Sign in to BetLedger.
2. Add or edit a test bet.
3. Wait for `Saved to Cloudflare`.
4. In the D1 console, run:

```sql
SELECT user_id, updated_at, length(bets_json) AS bets_json_size
FROM user_state;
```

5. Sign in to the same account on another device. The saved data should load automatically.

If the API reports `no such table: user_state`, execute `schema.sql` once in the D1 console.
