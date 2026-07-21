# BetLedger Pro

A responsive, dependency-free sports betting profit-and-loss tracker designed for GitHub Pages.

## Version 2.1 features

- Starting bankroll and current bankroll tracking
- Standard unit size and unit-based P/L
- Net profit, ROI, win rate, average stake, pending exposure, and average odds
- Closing Line Value (CLV) using bet odds versus closing odds
- Pregame versus live-bet tracking
- Performance breakdowns by sport, market, sportsbook, and timing
- Monthly performance table
- Bankroll curve and cumulative P/L chart
- Add, edit, delete, search, and filter wagers
- Automatic American-odds payout calculation
- Complete JSON backup and restore
- CSV export for spreadsheet analysis
- Local browser storage
- Responsive desktop, tablet, and mobile layouts
- Demo dataset for testing

## Manual GitHub upload

1. Open your `Bet-Ledger` repository on GitHub.
2. Select **Add file → Upload files**.
3. Upload `index.html` and `README.md` from this folder.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the `main` branch and the `/ (root)` folder, then save.

Your site should be published at:

`https://jarolgutierrez5-netizen.github.io/Bet-Ledger/`

## Data storage and device syncing

GitHub Pages hosts the application files, but wagers are stored in the browser's `localStorage`. They are not automatically committed to GitHub and do not automatically sync between devices.

Use **Backup JSON** to download a complete copy of the ledger and settings. On another device, choose **Restore JSON** to import that backup. CSV exports are intended for analysis and external recordkeeping.

## Important security note

Do not place a GitHub personal access token directly in `index.html`. Any token included in a public GitHub Pages site can be seen and misused by visitors. True authenticated multi-device cloud sync should use a backend service such as Supabase or Firebase with appropriate access controls.

## Run locally

Open `index.html` in any modern browser. No installation, build process, server, or external dependency is required.

## Disclaimer

This application is for personal recordkeeping and informational use. It does not provide betting advice or guarantee outcomes. Bet responsibly.


## Version 2.1 Fixes

- Load Demo now confirms success and opens the Bets ledger automatically.
- JSON restore now opens the Bets ledger and reports the restored record count.
- Added visible success/error notifications.
- Added browser-storage error handling.

## GitHub Data Sync Note

GitHub Pages can host the tracker automatically, but a public browser app should not contain a GitHub personal access token. Storing a token in frontend JavaScript or browser storage can expose repository write access. For secure cross-device bet syncing, use an authenticated database service or a small server-side API rather than committing live wager data directly from the browser.


## Version 2.1 Fixes

- Added explicit form validation messages when required fields are missing.
- Added visible success and error notifications after saving a bet.
- Added guarded browser-storage handling so restricted localStorage no longer makes the form silently fail.
- Added automatic payout completion for wins and pushes when the payout field is blank.

## GitHub Sync Limitation

GitHub Pages can host this application, but the browser cannot securely commit each saved bet to the repository without a GitHub access token or backend service. Do not embed a personal access token in `index.html`, especially in a public repository. For multi-device automatic syncing, use a private database/backend such as Supabase or Firebase.
