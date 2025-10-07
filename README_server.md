
# FastFood Fullstack (Node + Express + SQLite)

## Quick start (local)

1. Install Node.js (v18+ recommended).
2. In project folder, install dependencies:
   ```bash
   npm install
   ```
3. Run migrations to create the database and sample data:
   ```bash
   npm run migrate
   ```
4. Start server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000 in your browser.

## Admin
- Default admin: `admin` / `admin123`
- Login via POST /api/admin/login to get JWT, then use `Authorization: Bearer <token>` header for admin routes.

## Notes
- Uploaded images are saved to `/uploads` and served at `/uploads/...`.
- Frontend files are inside `/frontend` (served statically). You can replace them with your custom UI.
