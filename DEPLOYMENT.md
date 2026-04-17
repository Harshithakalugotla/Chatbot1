# QuickGPT — Deployment Guide

## Project Structure
```
QuickGPT_Redesigned/
├── client/          ← React (Vite) frontend → Deploy to Vercel
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── ChatBox.jsx
│   │       └── Sidebar.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── server/          ← Express backend → Deploy to Railway / Render
    ├── index.js
    ├── package.json
    └── .env.example
```

---

## 🚀 Step 1 — Deploy Backend (Railway or Render)

### Option A: Railway
1. Go to https://railway.app and sign in with GitHub
2. Click **New Project → Deploy from GitHub Repo**
3. Select your repo, set **Root Directory** to `server`
4. Add environment variable: `GROQ_API_KEY = your_key_here`
5. Railway auto-deploys — copy the generated URL (e.g. `https://quickgpt-server.up.railway.app`)

### Option B: Render
1. Go to https://render.com → New → Web Service
2. Connect GitHub, set **Root Directory** to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env var `GROQ_API_KEY`
6. Copy the service URL

---

## 🚀 Step 2 — Update Frontend API URL

In `client/src/components/ChatBox.jsx`, line ~34:

```js
// Change this:
const res = await fetch("http://localhost:5000/chat", { ... })

// To your deployed backend URL:
const res = await fetch("https://your-backend-url.railway.app/chat", { ... })
```

Or use an environment variable:
```js
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const res = await fetch(`${API}/chat`, { ... })
```

Then create `client/.env`:
```
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 🚀 Step 3 — Deploy Frontend to Vercel

### Method A: Vercel CLI
```bash
cd client
npm install
npm run build        # Test build locally first
npx vercel           # Follow prompts
```

### Method B: Vercel Dashboard (Recommended)
1. Push your project to GitHub
2. Go to https://vercel.com → **Add New Project**
3. Import your GitHub repository
4. Set **Root Directory** → `client`
5. Framework: **Vite** (auto-detected)
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Add environment variable: `VITE_API_URL = https://your-backend-url`
9. Click **Deploy** ✅

### Build Settings Summary
| Setting | Value |
|---|---|
| Framework | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node Version | 18.x or 20.x |

---

## 🔧 Local Development

```bash
# Terminal 1 — Backend
cd server
npm install
echo "GROQ_API_KEY=your_key" > .env
npm start

# Terminal 2 — Frontend
cd client
npm install
npm run dev
# Open http://localhost:5173
```
