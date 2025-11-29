# EduPort — Frontend-Only Portfolio & Project Tracker

This is a lightweight frontend-only React app (Vite) that simulates a student/admin portfolio workflow using localStorage for persistence.

Features
- Mock authentication (student/admin) using seeded users or registration
- Student dashboard: create/edit portfolio, upload image previews, milestones with progress
- Admin dashboard: view student submissions, add feedback, approve/reject (UI only)
- Public portfolio view with media gallery, timeline, and "Download as PDF" using jsPDF

Quick start
1. Install dependencies:

```powershell
cd "c:\Users\Chandra harsha U\Desktop\cursor\eduport"
npm install
```

2. Run dev server:

```powershell
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`).

Seeded accounts
- Admin: `admin@example.com` / `admin`
- Students: `alice@example.com` / `student`, `bob@example.com` / `student`

Notes
- All data is stored in `localStorage`. Clearing browser data removes it.
- Media are only previewed as Data URLs and saved in localStorage (not uploaded anywhere).
- This is intentionally frontend-only for demo and teaching purposes.

Next steps (optional)
- Add input validation and nicer UI components
- Add client-side search and filters in admin
- Replace localStorage with a small mock server if needed

Enjoy — open an issue or ask for features!
