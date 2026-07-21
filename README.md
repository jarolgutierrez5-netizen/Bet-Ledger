# BetLedger Pro v2.6 — Compact UI

This release reduces the overall visual scale while preserving all Cloudflare Pages, Pages Functions, D1, and two-user functionality.

## Changes

- Narrower desktop sidebar
- Smaller navigation buttons and account control
- More compact dashboard header
- Shorter metric cards with reduced padding
- Smaller panel headings and chart footprint
- Denser forms, filters, tables, badges, and settings cards
- Improved tablet and mobile spacing
- Jarol/Mateo authentication and separate D1 data remain unchanged

## Update an existing deployment

Replace only these files in the GitHub repository:

- `index.html`
- `README.md`

Do not replace or delete `functions/`, `wrangler.toml`, `schema.sql`, the D1 database, or Cloudflare secrets.

Commit to `main`. Cloudflare Pages will redeploy automatically.
