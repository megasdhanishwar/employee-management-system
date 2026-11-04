# PeoplePulse — Employee Management System

Professional responsive React + Vite employee management dashboard.

## Start

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Features

- Dashboard KPIs, department breakdown and illustrative growth chart
- Employee directory with search, department/status filters, sorting and pagination
- Add, edit, view, delete employee records with validation
- Department CRUD (renaming a department also updates employee assignments)
- Leave approval and rejection with confirmation dialogs
- Attendance summary with demo metrics
- Admin profile settings, dark/light theme, reset demo data
- Collapsible sidebar on desktop and mobile drawer navigation
- Toast notifications, empty states, responsive tables
- Browser localStorage persistence (no backend required)

## Notes

Demo data is seeded on first load. The attendance data and growth chart are illustrative; this is not a production attendance tracker. Browser storage is not shared between devices. The app does not include authentication or server APIs.

## Structure

- `src/components/` shared layout and UI
- `src/context/` localStorage and application actions
- `src/data/` seeded demo records
- `src/pages/` separate page modules
- `src/utils/` formatting helpers
- `src/styles.css` complete responsive styles and themes
