# ⬡ ShaanOS — Hyprland Terminal Portfolio

A developer portfolio that simulates a **Hyprland Linux desktop** with glassmorphism Alacritty-style terminals. Visitors explore projects, skills, and more by typing commands.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)

---

## ✨ Features

| Feature                 | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| 🖥️ **Hyprland Desktop** | Tiling window manager with 1/2/3/4 terminal layouts                               |
| 🧊 **Glassmorphism**    | Frosted glass terminals with blur, glow, and translucency                         |
| ⌨️ **14 Commands**      | help, about, skills, projects, resume, contact, neofetch, matrix, coffee, sudo... |
| 🚀 **Boot Sequence**    | Staged Linux-style boot animation on first visit                                  |
| 🟢 **Matrix Rain**      | Always-on canvas-based Katakana character rain                                    |
| 🔐 **Admin Dashboard**  | Hidden `/admin` panel with JWT auth + project CRUD                                |
| 📱 **Responsive**       | Optimized for phones, tablets, laptops, desktops, and ultra-wide                  |
| 🌐 **REST API**         | Express + MongoDB backend with offline fallback                                   |

---

## 🚀 Quick Start

```bash
# Install everything
npm run install:all

# Run both frontend + backend
npm run dev

# Or run separately
npm run dev:frontend    # http://localhost:5173
npm run dev:backend     # http://localhost:5000
```

**Admin login:** `/admin` → username: `admin` / password: `admin123`

---

## ⌨️ Keybindings

| Shortcut        | Action                     |
| --------------- | -------------------------- |
| `Alt + Enter`   | Open new terminal          |
| `Alt + Q`       | Close terminal             |
| `Alt + H/J/K/L` | Navigate between terminals |

---

## 📂 Project Structure

```
Shaans-Portfolio/
├── package.json            Root orchestrator (runs both)
├── README.md               You are here
├── DEPLOYMENT.md           Free hosting guide
├── PROJECT_OVERVIEW.md     Architecture overview
│
├── frontend/               React + Vite app
│   ├── src/
│   │   ├── components/     UI components
│   │   ├── commands/       Terminal command system
│   │   └── store/          Zustand state management
│   ├── developers-debug/   Frontend docs (8 guides)
│   ├── vite.config.js
│   └── package.json
│
└── backend/                Express + MongoDB API
    ├── models/             Mongoose schemas
    ├── routes/             API endpoints
    ├── controllers/        Business logic
    ├── middleware/          JWT auth
    ├── developers-debug/   Backend docs (3 guides)
    ├── .env                Secrets (not in git)
    └── package.json
```

---

## 📖 Developer Documentation

> **New to this codebase?** Start with the [Project Overview](PROJECT_OVERVIEW.md).

### Frontend Docs (`frontend/developers-debug/`)

| Doc                                                                 | What It Covers                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| [Frontend Guide](frontend/developers-debug/FRONTEND_GUIDE.md)       | React, Vite, Zustand, Framer Motion, TailwindCSS, Axios |
| [Terminal System](frontend/developers-debug/FEATURE_TERMINAL.md)    | Command flow, state, focus management                   |
| [Tiling WM](frontend/developers-debug/FEATURE_TILING_WM.md)         | Layouts, keybindings, grid CSS                          |
| [Glassmorphism](frontend/developers-debug/FEATURE_GLASSMORPHISM.md) | Blur, transparency, glow effects                        |
| [Commands](frontend/developers-debug/FEATURE_COMMANDS.md)           | All 14 commands + how to add new ones                   |
| [Boot Sequence](frontend/developers-debug/FEATURE_BOOT_SEQUENCE.md) | Boot animation timing + customization                   |
| [Matrix Rain](frontend/developers-debug/FEATURE_MATRIX_RAIN.md)     | Canvas rendering, characters, z-index                   |
| [Responsive](frontend/developers-debug/FEATURE_RESPONSIVE.md)       | All breakpoints + device limits                         |

### Backend Docs (`backend/developers-debug/`)

| Doc                                                                    | What It Covers                                |
| ---------------------------------------------------------------------- | --------------------------------------------- |
| [Backend Guide](backend/developers-debug/BACKEND_GUIDE.md)             | Express, MongoDB, Mongoose, JWT, CORS, dotenv |
| [API Reference](backend/developers-debug/FEATURE_BACKEND_API.md)       | All endpoints, schema, middleware pipeline    |
| [Admin Dashboard](backend/developers-debug/FEATURE_ADMIN_DASHBOARD.md) | Auth flow, CRUD, security                     |

### Deployment

| Doc                               | What It Covers                                |
| --------------------------------- | --------------------------------------------- |
| [Deployment Guide](DEPLOYMENT.md) | Free hosting: Vercel + Render + MongoDB Atlas |

---

## 🛠️ Tech Stack

| Layer         | Tech               | Purpose                        |
| ------------- | ------------------ | ------------------------------ |
| **Framework** | React 19           | Component-based UI             |
| **Build**     | Vite 6             | Dev server + bundler           |
| **Styling**   | TailwindCSS v4     | CSS processing                 |
| **State**     | Zustand            | Global terminal state          |
| **Animation** | Framer Motion      | Layout + enter/exit animations |
| **HTTP**      | Axios              | API calls with fallback        |
| **Routing**   | React Router v7    | `/` and `/admin` routes        |
| **Server**    | Express 4          | REST API                       |
| **Database**  | MongoDB + Mongoose | Project storage                |
| **Auth**      | JWT + bcryptjs     | Admin authentication           |

---

## 📡 API Reference

```
GET    /api/projects       Public  — List all projects
GET    /api/projects/:id   Public  — Get one project
POST   /api/projects       Admin   — Create project
PUT    /api/projects/:id   Admin   — Update project
DELETE /api/projects/:id   Admin   — Delete project
POST   /api/admin/login    Public  — Get JWT token
```

---

## 📄 License

MIT
