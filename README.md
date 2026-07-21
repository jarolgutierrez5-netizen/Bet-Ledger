# BetLedger Pro v2.4 — Cloudflare Edition

Private two-user sports-betting ledger for **Jarol** and **Mateo**.

## Included

- Colorful responsive dashboard
- Separate Jarol and Mateo accounts
- Cloudflare Pages Functions authentication
- HttpOnly signed session cookies
- Cloudflare D1 storage
- User-specific local cache for temporary offline access
- JSON backup and CSV export
- No public registration

## 1. Create the D1 database

Install Node.js, open a terminal in this folder, and run:

```bash
npx wrangler login
npx wrangler d1 create betledger-db
```

Copy the returned database ID into `wrangler.toml`.

Apply the schema:

```bash
npx wrangler d1 execute betledger-db --remote --file=schema.sql
```

## 2. Push this folder to GitHub

Upload the complete folder contents, including the `functions` directory, to a GitHub repository.

## 3. Create a Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages**.
2. Create a Pages project and connect the GitHub repository.
3. Framework preset: **None**.
4. Build command: leave blank.
5. Build output directory: `.`
6. Deploy.

Dashboard drag-and-drop is not suitable because this application uses Pages Functions.

## 4. Bind D1

In the Pages project:

1. **Settings → Bindings → Add binding**.
2. Choose **D1 database**.
3. Variable name: `BETLEDGER_DB`
4. Select `betledger-db`.
5. Add the binding to Production and Preview if desired.
6. Redeploy.

## 5. Add encrypted secrets

In **Settings → Variables and Secrets**, add these as encrypted secrets:

- `JAROL_PASSWORD`
- `MATEO_PASSWORD`
- `SESSION_SECRET`

Use unique passwords and a long random session secret. Example session-secret generator:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit real passwords or the session secret to GitHub.

## 6. Sign in

Open the deployed Cloudflare Pages URL, choose Jarol or Mateo, and enter the matching password.

Each account receives:

- A separate D1 row
- A separate signed session
- A separate local browser cache namespace
- A separate dashboard, bankroll, bets, and analytics

## Security notes

- Passwords are read only from encrypted Cloudflare environment secrets.
- Sessions use signed, HttpOnly, Secure, SameSite=Strict cookies.
- API routes accept only `jarol` and `mateo`.
- The database is never directly accessible from browser JavaScript.
- Use HTTPS only; Cloudflare Pages provides HTTPS automatically.

## Updating

Replace repository files with the new version and push to the connected branch. Cloudflare Pages will redeploy automatically.

## Version 2.5 — Sidebar Dashboard Redesign

- Replaced the oversized top utility bar with a fixed left navigation layout.
- Added a compact Dashboard header and signed-in user chip.
- Moved backup, restore, CSV export, demo data, and reset controls into Settings.
- Restyled cards, charts, tables, forms, analytics, and navigation to match the supplied dark dashboard reference.
- Preserved Cloudflare Pages Functions, D1 synchronization, and separate Jarol/Mateo data.
- Added responsive tablet and mobile navigation behavior.
