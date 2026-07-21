# BetLedger Pro v2.7 — Automatic Cloud Sync

This release makes Cloudflare D1 the primary shared data store for each account.

## What changed

- Automatically saves every bet, edit, deletion, bankroll change, import, reset, and demo-data change to Cloudflare D1.
- Uses a 750 ms debounced save to avoid unnecessary writes.
- Automatically loads the account's latest D1 data at login.
- Retries pending changes when internet access returns.
- Checks for newer cloud data every 20 seconds while the app is open and whenever the tab becomes active.
- Displays `Saving…`, `Saved to Cloudflare`, `Pending sync`, or `Sync failed` status.
- Keeps localStorage only as an offline cache.
- Removes obsolete Supabase sync code that could override the Cloudflare implementation.

## Deployment

For an existing Cloudflare Pages deployment, replace `index.html` and `README.md` in the GitHub repository and commit to the deployed branch.

The existing `functions/`, `schema.sql`, `wrangler.toml`, D1 database, bindings, and Cloudflare secrets can remain unchanged.

## Verify

1. Sign in and add a test bet.
2. Wait until the status reads `Saved to Cloudflare`.
3. In the D1 console run:

```sql
SELECT user_id, updated_at, length(bets_json) AS bets_json_size FROM user_state;
```

4. Sign in to the same account on another device. The test bet should load automatically.
