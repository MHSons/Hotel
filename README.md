
# Mellow Cheez — Fast Food Static Site (GitHub Pages)

This is a static single-page web app for a fast-food restaurant.
Features:
- Menu management (Admin - localStorage)
- Cart and local orders (Delivery/Pickup, multiple payment options simulated)
- Table reservations (saved locally)
- Daily deals, reviews/feedback (localStorage)
- Export orders (CSV/JSON) by date range
- Logo upload and theme switch (Black-Gold or Red-Yellow)

## Files
- `index.html` — main page
- `style.css` — styles
- `script.js` — JavaScript logic (localStorage)
- `logo.png` — logo (copied from uploaded image if provided)

## How to use
1. Upload repository to GitHub and enable GitHub Pages (branch `main`, folder `/`).
2. Or open `index.html` locally in your browser.
3. Admin: click **Admin** and enter password `1234` to manage menu, deals and export orders.
4. All data is stored in browser localStorage. Clearing browser data will remove it.

## Notes
- This is a static/demo implementation. For real online payments and centralized order management you need a backend + payment gateway.
- CSV export opens a browser download; use the date filters for daily/monthly/quarterly/yearly exports.
