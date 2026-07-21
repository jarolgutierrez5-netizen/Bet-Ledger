# BetLedger Pro v2.2 — Personal Cloud Sync

A responsive sports-betting profit-and-loss tracker for GitHub Pages with optional Supabase cloud syncing.

## What changed in v2.2

- Secure email/password sign-in
- Automatic cloud sync after saves, edits, deletions, imports, resets, and settings changes
- Cross-device access through your personal Supabase account
- Manual **Pull cloud data** control
- Local browser fallback when offline or before cloud setup
- Row Level Security so each authenticated user can access only their own ledger
- Visible cloud connection and sync status
- JSON and CSV backup tools remain available

## Files to upload to GitHub

Upload all four files to the root of your `Bet-Ledger` repository:

- `index.html`
- `README.md`
- `supabase-config.js`
- `supabase-setup.sql`

## 1. Create the free Supabase project

1. Create a Supabase account and a new project.
2. In the project dashboard, open **SQL Editor**.
3. Copy all content from `supabase-setup.sql`.
4. Run the SQL once.

This creates one private cloud-state row per authenticated user and enables Row Level Security.

## 2. Add your safe browser credentials

1. In Supabase, open **Project Settings → API**.
2. Copy the **Project URL**.
3. Copy the **Publishable key**. Older projects may label the equivalent low-privilege key as `anon`.
4. Open `supabase-config.js` and replace:

```js
window.BETLEDGER_SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
window.BETLEDGER_SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY';
```

Never put a secret key, `sb_secret_...` key, or `service_role` key in this file.

## 3. Configure authentication URLs

In Supabase, open **Authentication → URL Configuration**.

Set the Site URL to:

`https://jarolgutierrez5-netizen.github.io/Bet-Ledger/`

Add the same URL under allowed redirect URLs.

For simplest personal use, you may leave email confirmation enabled and confirm the first signup email. You may also disable email confirmation in the Supabase authentication provider settings if you understand the tradeoff and only use this privately.

## 4. Upload and publish

1. Open the GitHub repository `jarolgutierrez5-netizen/Bet-Ledger`.
2. Select **Add file → Upload files**.
3. Upload all four files.
4. Commit to `main`.
5. Open **Settings → Pages**.
6. Choose **Deploy from a branch**.
7. Select `main` and `/ (root)`.

Published site:

`https://jarolgutierrez5-netizen.github.io/Bet-Ledger/`

## 5. First use

1. Open the published site.
2. Select **Cloud setup** or open **Settings**.
3. Enter your email and a password of at least six characters.
4. Select **Create account**.
5. Confirm the email if your Supabase project requires it.
6. Sign in.
7. Add a bet. The cloud indicator should change to **Cloud synced**.

The first device with existing local wagers uploads them when no cloud record exists. A device with no local data automatically pulls the cloud ledger after sign-in. The **Pull cloud data** button can explicitly replace local data with the cloud copy.

## Data safety

- The application saves locally first, so temporary connectivity problems do not block bet entry.
- Cloud synchronization is debounced briefly after changes.
- Use **Backup JSON** periodically for an independent offline backup.
- Simultaneous edits on two devices use a last-write-wins model because the complete personal ledger is stored as one JSON state record.

## Existing analytics

- Starting and current bankroll
- Units and net P/L
- ROI and win rate
- Pending exposure
- Average odds and stake
- Closing Line Value
- Performance by sport, market, sportsbook, and timing
- Monthly reporting
- Bankroll chart
- JSON restore and CSV export

## Disclaimer

This application is for personal recordkeeping and informational use. It does not provide betting advice or guarantee outcomes. Bet responsibly.
