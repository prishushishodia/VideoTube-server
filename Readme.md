# VideoTube — Full-Stack YouTube Clone

A monorepo containing the backend API and frontend client.

```
Youtube/
├── Backend/    Express + MongoDB REST API  (port 8000)
└── Frontend/   React + Vite + Tailwind SPA (port 5173)
```

## Backend (`/Backend`)
Express, Mongoose (MongoDB), JWT auth, Cloudinary uploads. Routes under `/api/v1`.

```bash
cd Backend
fnm use 20        # backend requires Node 20 (see .node-version)
npm install
npm run dev       # http://localhost:8000
```

Requires a local `.env` (not committed) with `MONGODB_URI`, `DB_NAME`, JWT secrets, and Cloudinary keys.

Seed demo data (10 users, videos, comments, likes, subs, playlists):
```bash
node -r dotenv/config src/seed.js
```

## Frontend (`/Frontend`)
React 19, React Router, Axios, TailwindCSS.

```bash
cd Frontend
npm install
npm run dev       # http://localhost:5173
```

Set `VITE_API_BASE_URL` in `Frontend/.env` to point at the backend.
