# 🚀 Deployment Guide — Shaan's Portfolio

> **Architecture:** Frontend on **Vercel** (free) + Backend on **Render** (free) + **MongoDB Atlas** (free)
>
> **Custom Domain:** `shaans.works` → Vercel, `api.shaans.works` → Render

---

## Prerequisites

Before starting, make sure you have:

- [ ] A **GitHub account** with this repo pushed (public or private — both work)
- [ ] A **MongoDB Atlas** account with a free M0 cluster ([signup here](https://www.mongodb.com/cloud/atlas/register))
- [ ] Your domain `shaans.works` purchased from a registrar (Namecheap, Porkbun, Cloudflare, etc.)
- [ ] A **Vercel** account ([signup here](https://vercel.com/signup) — use "Continue with GitHub")
- [ ] A **Render** account ([signup here](https://render.com) — use "Continue with GitHub")

---

## Step 1: Push Code to GitHub

If you haven't already:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Step 2: Deploy Backend on Render

### 2.1 — Create a new Web Service

1. Go to [render.com/dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** → find and select your `Shaans-Portfolio` repo
4. Click **"Connect"**

### 2.2 — Configure the service

Fill in the settings:

| Setting            | Value                                     |
| ------------------ | ----------------------------------------- |
| **Name**           | `shaans-portfolio-api`                    |
| **Region**         | Pick the closest to you (e.g., Singapore) |
| **Branch**         | `main`                                    |
| **Root Directory** | `backend`                                 |
| **Runtime**        | `Node`                                    |
| **Build Command**  | `npm install`                             |
| **Start Command**  | `npm start`                               |
| **Instance Type**  | **Free**                                  |

### 2.3 — Add environment variables

Scroll down to **"Environment Variables"** and add these one by one:

| Key               | Value                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `PORT`            | `10000`                                                                                                                                    |
| `MONGODB_URI`     | Your Atlas connection string (looks like `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/shaan-portfolio?retryWrites=true&w=majority`) |
| `JWT_SECRET`      | Any long random string (e.g., `a8f2k9d3m5x7p1q4w6e0r3t5y8u2i4o`)                                                                           |
| `ADMIN_USERNAME`  | Your admin username                                                                                                                        |
| `ADMIN_PASSWORD`  | Your admin password                                                                                                                        |
| `ALLOWED_ORIGINS` | `https://shaans.works,https://www.shaans.works`                                                                                            |

> **How to get your MongoDB URI:**
>
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Click **"Connect"** on your cluster
> 3. Choose **"Connect your application"**
> 4. Copy the connection string
> 5. Replace `<password>` with your actual database user password

### 2.4 — Deploy

Click **"Create Web Service"** and wait for it to build (~2-3 minutes).

Once deployed, you'll see a URL like:

```
https://shaans-portfolio-api.onrender.com
```

**Test it:** Open `https://shaans-portfolio-api.onrender.com/api/health` in your browser.
You should see: `{"status":"ok","timestamp":"..."}`

> ⚠️ **Note:** Render's free tier sleeps after 15 min of inactivity. The first request after sleeping takes ~30 seconds. This is normal.

---

## Step 3: Deploy Frontend on Vercel

### 3.1 — Create a new project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import"** next to your `Shaans-Portfolio` repo
3. If you don't see it, click **"Adjust GitHub App Permissions"** to grant access

### 3.2 — Configure the project

| Setting              | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| **Project Name**     | `shaans-portfolio` (or anything you like)                 |
| **Framework Preset** | `Vite`                                                    |
| **Root Directory**   | Click **"Edit"** → type `frontend` → click **"Continue"** |
| **Build Command**    | `npm run build` (auto-detected)                           |
| **Output Directory** | `dist` (auto-detected)                                    |

### 3.3 — Add environment variable

Expand **"Environment Variables"** and add:

| Key            | Value                                       |
| -------------- | ------------------------------------------- |
| `VITE_API_URL` | `https://shaans-portfolio-api.onrender.com` |

> ⚠️ Use the **exact Render URL** from Step 2.4. No trailing slash!

### 3.4 — Deploy

Click **"Deploy"** and wait (~1-2 minutes).

Once done, Vercel gives you a URL like `https://shaans-portfolio.vercel.app`. Visit it to confirm your site works!

---

## Step 4: Connect Your Custom Domain

### 4.1 — Add domain to Vercel

1. In Vercel, go to your project → **Settings** → **Domains**
2. Type `shaans.works` and click **"Add"**
3. Vercel will show you the DNS records you need to add
4. Also add `www.shaans.works`

### 4.2 — Add API subdomain to Render

1. In Render, go to your web service → **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Type `api.shaans.works` and click **"Save"**

### 4.3 — Configure DNS at your domain registrar

Log into wherever you bought `shaans.works` (Namecheap, Porkbun, Cloudflare, etc.) and add these DNS records:

**For the main site (Vercel):**

| Type      | Name/Host | Value                  | TTL  |
| --------- | --------- | ---------------------- | ---- |
| **A**     | `@`       | `76.76.21.21`          | Auto |
| **CNAME** | `www`     | `cname.vercel-dns.com` | Auto |

**For the API (Render):**

| Type      | Name/Host | Value                               | TTL  |
| --------- | --------- | ----------------------------------- | ---- |
| **CNAME** | `api`     | `shaans-portfolio-api.onrender.com` | Auto |

> **DNS tips for beginners:**
>
> - `@` means the root domain (`shaans.works`)
> - `www` means `www.shaans.works`
> - `api` means `api.shaans.works`
> - Changes can take 5 minutes to 48 hours to propagate (usually under 30 min)
> - You can check propagation at [dnschecker.org](https://dnschecker.org)

### 4.4 — Wait and verify

1. Wait a few minutes for DNS to propagate
2. Visit `https://shaans.works` — your portfolio should load!
3. Visit `https://api.shaans.works/api/health` — should show `{"status":"ok"}`
4. Vercel and Render both auto-provision **free SSL/HTTPS** certificates

---

## Step 5: Final Environment Variable Updates

Now that custom domains are live, update your env vars to use them:

### On Vercel:

1. Go to project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` to `https://api.shaans.works`
3. Go to **Deployments** → click the **"..."** on the latest → **"Redeploy"**

### On Render:

1. Go to your web service → **Environment**
2. Verify `ALLOWED_ORIGINS` is set to `https://shaans.works,https://www.shaans.works`
3. It will auto-redeploy when you save

---

## Step 6: Seed Your Database (If Empty)

If you haven't added any projects yet, you can seed sample data:

```bash
# Run this locally on your machine
cd backend
cp .env.example .env
# Edit .env with your real MongoDB URI and other values
npm run seed
```

Or just go to `https://shaans.works/admin`, log in, and add projects manually!

---

## Troubleshooting

### "CORS error" in browser console

→ Make sure `ALLOWED_ORIGINS` on Render includes your exact frontend URL (with `https://`, no trailing slash)

### Site works but API calls fail

→ Check that `VITE_API_URL` on Vercel is set correctly and you **redeployed** after changing it

### `/admin` page shows 404 on refresh

→ Make sure `frontend/vercel.json` exists with the SPA rewrite rule (already added!)

### Render shows "Build failed"

→ Make sure **Root Directory** is set to `backend`, not the repo root

### Vercel shows "Build failed"

→ Make sure **Root Directory** is set to `frontend`, not the repo root

### First visit is slow

→ Render free tier sleeps after 15 min of inactivity. First request takes ~30 sec to wake up. This is normal for the free plan.

### MongoDB connection fails

→ In MongoDB Atlas, go to **Network Access** → **Add IP Address** → click **"Allow Access from Anywhere"** (`0.0.0.0/0`). This is required for Render to connect.

---

## Architecture Diagram

```
                    ┌─────────────────────┐
                    │   shaans.works      │
                    │   (Your Browser)    │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │                               │
              ▼                               ▼
   ┌──────────────────┐           ┌──────────────────┐
   │  Vercel (Free)   │           │  Render (Free)   │
   │  Frontend (React)│  ──API──▶ │  Backend (Express)│
   │  shaans.works    │           │  api.shaans.works │
   └──────────────────┘           └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ MongoDB Atlas     │
                                  │ (Free M0 Cluster) │
                                  └──────────────────┘
```

---

## Auto-Deploy

Both Vercel and Render automatically redeploy when you push to `main` on GitHub. Just:

```bash
git add .
git commit -m "your changes"
git push
```

And both frontend and backend will update automatically! 🎉

---

## Cost Summary

| Service                 | Plan                    | Cost                       |
| ----------------------- | ----------------------- | -------------------------- |
| Vercel                  | Hobby (Free)            | **$0**                     |
| Render                  | Free                    | **$0**                     |
| MongoDB Atlas           | M0 (Free)               | **$0**                     |
| Domain (`shaans.works`) | Registrar               | ~$2-10/year                |
| SSL/HTTPS               | Auto by Vercel & Render | **$0**                     |
| **Total**               |                         | **$0/month** + domain cost |
