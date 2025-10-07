
# Mellow Cheez - Fast Food Website (Static)

This is a **complete frontend-only** fast-food restaurant website with an Admin Panel that stores data in **LocalStorage**.  
It is designed to be dropped into a GitHub repository (static site) and opened locally (or hosted on GitHub Pages).

## Features
- Customer site: Menu browse, search, deals, cart, place order (simulated).
- Admin panel: Login (default admin/admin123), manage restaurant settings, add/edit/delete menu items, add/delete deals, view & manage orders.
- Image upload (images saved as Base64 in LocalStorage).
- All data persists in browser LocalStorage (no server required).
- Responsive layout using Bootstrap.
- Ready for GitHub: static files only.

## How to use locally
1. Unzip the folder and open `index.html` in a modern browser.
2. Visit `admin.html` to log in as admin.
   - Default credentials: `admin` / `admin123`

## Files
- `index.html` - Customer-facing site
- `admin.html` - Admin panel
- `app.js` - Customer site logic
- `admin.js` - Admin panel logic
- `styles.css` - Basic styling
- `logo.png` - Logo (if provided)

## Notes & Next steps
- This is intentionally frontend-only. For production, add a backend (Node/Express, or serverless functions) for secure logins, persistent storage, image uploads, and payment integration.
- You can export localStorage data for migration; orders and menu are stored in the browser.

