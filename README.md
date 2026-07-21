# BetLedger — Sports Betting P/L Tracker

A responsive, single-file sports betting profit-and-loss tracker that runs entirely in the browser.

## Features

- Add, edit, and delete wagers
- Track sport, event, selection, sportsbook, odds, stake, result, payout, and notes
- Automatic payout calculation for American odds
- Dashboard metrics for net P/L, ROI, win rate, total staked, pending risk, and average odds
- Cumulative profit chart
- Search and filters for sport, result, sportsbook, and date range
- CSV import and export
- Local browser storage
- Responsive desktop, tablet, and mobile layouts
- Demo-data loader

## How to use

1. Open `index.html` in Chrome, Edge, Safari, or Firefox.
2. Enter a wager and select its result.
3. For a winning wager, the payout is calculated automatically from the stake and American odds. You can overwrite it when needed.
4. Use the filters above the history table to analyze selected groups of bets.
5. Export your data to CSV regularly for backup.

## Data storage

All data is stored in the browser using `localStorage`. Data does not leave your device. Clearing browser storage may delete the saved wagers, so CSV exports are recommended.

## CSV format

The importer recognizes these columns:

`date,sport,event,betType,sportsbook,selection,odds,stake,result,payout,notes`

## Version

- v1.0 — Initial responsive P/L tracker with local storage, CSV tools, filtering, metrics, editing, and cumulative profit chart.
