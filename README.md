# BetLedger Pro

A responsive, dependency-free sports betting profit-and-loss tracker designed for GitHub Pages.

## Version 2.0 features

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
