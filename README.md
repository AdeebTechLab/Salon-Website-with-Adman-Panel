# Salon Website — Legend Barber Shop

A React 18 + Vite barber shop website with customer-facing pages and a demo admin panel.

## Pages

- `/` — Home page with hero, grooming categories, packages, featured barbers, reviews, contact details and booking call-to-action.
- `/services` — Services menu with category filtering.
- `/barbers` — Barber team.
- `/booking` — Appointment booking form.
- `/admin` — Demo admin panel for bookings, customers, records, services, barbers, reviews and website settings.

## Requirements

- Node.js (LTS recommended)
- npm

## Run locally

1. Extract or clone this repository.
2. Open the project folder in VS Code or a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Demo and security notes

- The admin panel currently uses a demo password: `admin123`. This is **not secure authentication**. Change/remove it before presenting the project publicly, and do not reuse this password for real accounts.
- The project stores booking, customer, review and settings data in the browser's `localStorage` (`legend-db-v2`). Data is local to the browser/device and is not shared through a server or database.
- Before using this website for real customers, add a backend/database, server-side authentication and validation, and appropriate privacy/security protections.
- Sample/demo data can be managed from **Admin → Website → Demo data**.

## Design and assets

- Main styles are in `src/index.css`.
- Icons are inline SVGs in `src/components/Icon.jsx`.
- The site uses Google Fonts and Pexels-hosted stock image URLs. Replace these with your own licensed shop photos when available.

## GitHub

The `.gitignore` excludes `node_modules`, `dist`, environment files and common editor/OS files. Do not commit real passwords, API keys, tokens or customer data.
